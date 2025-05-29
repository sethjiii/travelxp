import mongoose from "mongoose";

const { Schema } = mongoose;

// Emergency Contact Sub-Schema
const EmergencyContactSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, required: true },
});

// Traveler Sub-Schema
const TravelerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

// Booking Schema
const BookingSchema = new Schema({
  packageId: { type: Schema.Types.ObjectId, ref: "TravelPackage", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  numberOfTravelers: { type: Number, required: true },
  startDate: { type: String, required: true },
  specialRequests: { type: String, default: "" },
  emergencyContact: { type: EmergencyContactSchema, required: true },
  travelers: { type: [TravelerSchema], required: true },
  totalAmount: { type: Number, required: true },
}, {
  timestamps: true,
});

// Avoid recompiling the model if already compiled
const BookingModel = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default BookingModel;
