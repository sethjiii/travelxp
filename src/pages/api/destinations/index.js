import dbConnect from '../dbConnect';  // Adjust if needed
import Destination from '../../../models/Destination'; // Your Mongoose Destination model

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const destinations = await Destination.find({})
      .populate('packages') // This will populate the referenced TravelPackage documents
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({ destinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
