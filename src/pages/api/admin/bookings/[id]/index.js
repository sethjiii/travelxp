import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import dbConnect from '../../../dbConnect';

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
    
    // Extract the booking ID from the URL
    const  bookingId  = req.query.id;
    console.log(bookingId)
    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    // Fetch the booking by ID with proper ID conversion
    const booking = await db.collection('Bookings')
      .aggregate([
        {
          $match: { _id: new ObjectId(bookingId) },  // Match by booking ID
        },
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
        { $unwind: { path: '$package', preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    // Check if booking is found
    if (!booking || booking.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(booking[0]);  // Return the first (and only) booking

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
