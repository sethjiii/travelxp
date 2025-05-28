import { connectToDatabase } from '../dbConnect'; // adjust path

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to DB
    const { db } = await connectToDatabase();

    // Fetch all destinations sorted by createdAt descending
    const destinations = await db
      .collection('destinations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ destinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
