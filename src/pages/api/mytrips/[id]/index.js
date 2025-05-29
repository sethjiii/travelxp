import dbConnect from "../../dbConnect";
import Booking from "../../../../models/Bookings";
// import TravelPackage from "../../../../models/TravelPackages"; // ✅ required for .populate("packageId")
// import User from "../../../../models/user"; // Adjust the path as needed


export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { id } = req.query;
    const userId = id;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const bookings = await Booking.find({ userId })
      .populate("packageId") // ✅ This works now
      .populate("userId")
      .lean();

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Error fetching bookings" });
  }
}
