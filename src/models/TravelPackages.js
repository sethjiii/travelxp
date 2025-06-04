import mongoose from 'mongoose';

// Define the travelPackageSchema for the travel package model
const travelPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensures name is mandatory
    },
    places: {
      type: String,
      required: true, // Ensures places is mandatory
    },
    description: {
      type: String,
      required: true, // Ensures description is mandatory
    },
    itinerary: [
      {
        day: {
          type: Number, // Day number (e.g., 1, 2, 3)
          required: true,
        },
        title: {
          type: String, // Short title for the day's activities
          required: true,
        },
        description: {
          type: String, // Detailed description of the day's activities
        },
        stay: {
          type: String, // Stay information, e.g., 'Hotel XYZ'
        },
        activities: [
          {
            name: {
              type: String, // Name of the activity, e.g., 'Visit Qutub Minar'
              required: true,
            },
            time: {
              type: String, // Time of the activity, e.g., '9:00 AM - 11:00 AM'
            },
            additionalDetails: {
              type: String, // Extra details, e.g., 'Guided tour included'
            },
          },
        ],
      },
    ],
    // price: {
    //   type: Number, // Cost of the travel package
    //   required: true,
    // },
    // currency: {
    //   type: String, // Currency for the price, e.g., 'USD', 'INR'
    //   default: 'USD',
    // },
    
    duration: {
      type: String, // Total duration of the trip, e.g., '14 days, 13 nights'
    },
    highlights: {
      type: [String], // Key attractions, e.g., ['Taj Mahal', 'Amber Fort']
    },
    inclusions: {
      type: [String], // List of what's included, e.g., ['Accommodation', 'Guided tours', 'Flights']
    },
    exclusions: {
      type: [String], // List of what's not included, e.g., ['Personal expenses', 'Tips']
    },
    likes: {
      type: [String], // Array of user IDs who liked the package
      default: [],
    },
    comments: [
      {
        userId: {
          type: String, // ID of the user commenting
          required: true,
        },
        username: {
          type: String, // Display name of the user
          required: true,
        },
        comment: {
          type: String, // Text of the comment
        },
        createdAt: {
          type: Date, // Timestamp for the comment
          default: Date.now,
        },
      },
    ],
    // availability: {
    //   startDate: {
    //     type: Date, // Start date for the package availability
    //   },
    //   endDate: {
    //     type: Date, // End date for the package availability
    //   },
    // },
    images: {
      type: [String], // URLs of images showcasing the package or destinations
    },
    reviews: [
      {
        userId: {
          type: String, // ID of the user reviewing
          required: true,
        },
        username: {
          type: String, // Display name of the user
          required: true,
        },
        rating: {
          type: Number, // Rating out of 5
          min: 1,
          max: 5,
        },
        review: {
          type: String, // Review text
        },
        createdAt: {
          type: Date, // Timestamp for the review
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure the model is initialized only once
const TravelPackage =
  mongoose.models.TravelPackage || mongoose.model('TravelPackage', travelPackageSchema);

export default TravelPackage;
