import mongoose, { Schema } from "mongoose";


const EmergencyContactSchema = new Schema<EmergencyContact>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, required: true },
});

const TravelerSchema = new Schema<Traveler>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const BookingSchema = new Schema<Booking>({
  packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  numberOfTravelers: { type: Number, required: true },
  startDate: { type: String, required: true },
  specialRequests: { type: String, default: "" },
  emergencyContact: { type: EmergencyContactSchema, required: true },
  travelers: { type: [TravelerSchema], required: true },
  totalAmount: { type: Number, required: true },
});

const BookingModel = mongoose.models.Booking || mongoose.model<Booking>("Booking", BookingSchema);

export default BookingModel;
