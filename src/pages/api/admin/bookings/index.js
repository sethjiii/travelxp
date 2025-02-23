import jwt from 'jsonwebtoken';
import dbConnect from '../../dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { db } = await dbConnect();

  try {
    // Extract and verify the token
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    // Fetch bookings with proper ID conversion
    const bookings = await db.collection('Bookings')
      .aggregate([
        // Convert `userId` and `packageId` to ObjectId
        {
          $addFields: {
            userId: { $toObjectId: '$userId' },
            packageId: { $toObjectId: '$packageId' },
          },
        },
        {
          $lookup: {
            from: 'users',  // Users collection
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'TravelPackage',  // TravelPackage collection
            localField: 'packageId',
            foreignField: '_id',
            as: 'package',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$package', preserveNullAndEmptyArrays: true } },  // Change to true if package is optional
        { $sort: { startDate: -1 } },
      ])
      .toArray();

    // Check for empty result
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
