import { MongoClient } from 'mongodb';
const uri=process.env.MONGO_URI;
let cachedClient = null;
let cachedDb = null;

export default async function connectToDatabase() {
  try {
    // Check if the cached connection is available
    if (cachedClient && cachedDb) {
      // Check if the cached client is still connected by pinging
      const admin = cachedDb.admin();
      const serverStatus = await admin.ping();
      if (serverStatus) {
        console.log("Using cached MongoDB connection.");
        return { client: cachedClient, db: cachedDb };
      } else {
        // If cached client is disconnected, clear cache and reconnect
        console.log("Cached MongoDB client is disconnected, reconnecting...");
        cachedClient = null;
        cachedDb = null;
      }
    }

    // Initialize the MongoDB client with connection options
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 30000, // Increase socket timeout
    });

    // Connect to the MongoDB server
    await client.connect();

    // Specify the database name
    const db = client.db('traveleasy'); // Replace 'traveleasy' with your actual database name if different

    // Cache the client and db for reuse
    cachedClient = client;
    cachedDb = db;

    console.log("New MongoDB connection established.");
    return { client, db };
  } catch (error) {
    // Log and rethrow the error for debugging
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export { connectToDatabase };
