import dbConnect from '../dbConnect';
import TravelPackage from '../../../models/TravelPackages'; // Adjust the path to your TravelPackage model

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed, only GET supported' });
  }

  try {
    // Connect to MongoDB using Mongoose
    await dbConnect();

    // Fetch all travel packages, sorted by createdAt descending
    const packages = await TravelPackage.find({})
      .sort({ createdAt: -1 })
      .exec();

    // Send response
    res.status(200).json({ packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
}
