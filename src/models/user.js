import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
    },
    location: {
        type: String,
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude password from query results by default
    },
    phone: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: 'avatar.jpeg', // Default profile picture
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PackageCard',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false, // Whether the user has verified their email
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true }, // Default to receive email notifications
        sms: { type: Boolean, default: false },  // Default to not receive SMS notifications
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light', // Default theme is light
      },
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active', // Default status is active
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Create or reuse the User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
