import { connectToDatabase } from "../../dbConnect"; // Helper for MongoDB connection

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Establish DB connection
      const { db } = await connectToDatabase();

      // Extract booking data and userId from the request body
      const { bookingData, userId } = req.body;

      // Log the userId for verification
      console.log("Received userId:", req.body);

      // Include the userId in the booking data before inserting into the database
      const bookingWithUserId = {
        ...bookingData,
        userId: userId,  // Add userId to the booking data
      };

      // Insert the booking into the 'Bookings' collection
      const result = await db.collection("Bookings").insertOne(bookingWithUserId);

      // Check if insertion was successful
      if (result.acknowledged) {
        // Return booking confirmation with booking ID and userId
        res.status(201).json({
          bookingId: result.insertedId.toString(),
          userId: userId, // Send back userId as part of the response
        });
      } else {
        res.status(500).json({ error: "Failed to create booking" });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Error creating booking" });
    }
  } else {
    // Handle any method that is not POST
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
