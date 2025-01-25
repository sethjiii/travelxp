import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://jaynrk2002:pQdvpeodL8bzPNLS@cluster0.eqsuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to the MongoDB server
      await client.connect();
      // Send a ping to confirm successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. Successfully connected to MongoDB!");

      res.status(200).json({ message: "Successfully connected to MongoDB!" });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      res.status(500).json({ message: "Failed to connect to MongoDB", error: error.message });
    } finally {
      // Ensure the client is closed
      await client.close();
    }
  } else {
    // Handle unsupported methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
