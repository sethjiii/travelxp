import { connectToDatabase } from "../dbConnect"; // Helper for MongoDB connection

export default async function handler(req, res) {
  try {
    // Establish DB connection
    const { db } = await connectToDatabase();

    // Fetch all travel packages from the database using db.collection
    const packages = await db.collection("TravelPackage").find({}).toArray();
    console.log(packages)

    // Return the packages as a response
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
}
