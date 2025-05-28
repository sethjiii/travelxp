import dbConnect from "../../dbConnect";
import TravelPackage from "../../../../models/TravelPackages";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect(); // Ensure DB connection

  const { method } = req;
  const { id } = req.query;

  console.log("Package ID:", id);

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  switch (method) {
    case "GET":
      try {
        const travelPackage = await TravelPackage.findById(id);
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
        const updatedPackage = await TravelPackage.findByIdAndUpdate(
          id,
          { $set: req.body },
          { new: true } // Return updated doc
        );

        if (!updatedPackage) {
          return res.status(404).json({ error: "Package not found" });
        }

        res.status(200).json(updatedPackage);
      } catch (error) {
        console.error("Error updating package:", error);
        res.status(400).json({ error: "Failed to update package" });
      }
      break;

    case "DELETE":
      try {
        const deleted = await TravelPackage.findByIdAndDelete(id);

        if (!deleted) {
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
}
