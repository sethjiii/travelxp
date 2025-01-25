import { connectToDatabase } from "../../dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    // Establish a connection to the database
    const { db } = await connectToDatabase();

    const { method } = req;
    const { id } = req.query;

    console.log("Package ID:", id);

    // Validate the provided ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const objectId = new ObjectId(id);

    switch (method) {
      case "GET":
        try {
          const travelPackage = await db.collection("TravelPackage").findOne({ _id: objectId });
          console.log("Fetched Package:", travelPackage);

          if (!travelPackage) {
            return res.status(404).json({ error: "Package not found" });
          }

          res.status(200).json(travelPackage);
        } catch (error) {
          console.error("Error fetching package:", error);
          res.status(500).json({ error: "Failed to fetch package" });
        }
        break;

      case "PUT":
        try {
          const updatedPackage = await db
            .collection("TravelPackage")
            .findOneAndUpdate(
              { _id: objectId },
              { $set: req.body },
              { returnDocument: "after" } // Ensures the updated document is returned
            );

          if (!updatedPackage.value) {
            return res.status(404).json({ error: "Package not found" });
          }

          res.status(200).json(updatedPackage.value);
        } catch (error) {
          console.error("Error updating package:", error);
          res.status(400).json({ error: "Failed to update package" });
        }
        break;

      case "DELETE":
        try {
          const deletedPackage = await db.collection("TravelPackage").deleteOne({ _id: objectId });

          if (!deletedPackage.deletedCount) {
            return res.status(404).json({ error: "Package not found" });
          }

          res.status(200).json({ message: "Package deleted successfully" });
        } catch (error) {
          console.error("Error deleting package:", error);
          res.status(500).json({ error: "Failed to delete package" });
        }
        break;

      default:
        res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
