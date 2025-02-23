"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface TravelPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  availability: {
    startDate: string;
    endDate: string;
  };
  images: string[];
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface Traveler {
  name: string;
  email: string;
  phone: string;
}

interface BookingDetails {
  numberOfTravelers: number;
  startDate: string;
  specialRequests: string;
  emergencyContact: EmergencyContact;
  travelers: Traveler[];
}

const ConfirmationPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    numberOfTravelers: 1,
    startDate: "",
    specialRequests: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    travelers: [{ name: "", email: "", phone: "" }],
  });
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packageResponse = await fetch(`/api/packages/${id}`);
        const packageData = await packageResponse.json();
        setPackageData(packageData);

        const _id = localStorage.getItem("_id");
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email") || '';
        const phone = localStorage.getItem("phone") || '';

        const userData: UserProfile = {
          _id: _id || '',
          name: name || '',
          email,
          phone,
        };

        setUserProfile(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("emergency")) {
      const field = name.split(".")[1];
      setBookingDetails(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else if (name.startsWith("traveler")) {
      const index = parseInt(name.split(".")[1], 10);
      const field = name.split(".")[2];
      const updatedTravelers = [...bookingDetails.travelers];
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: value,
      };
      setBookingDetails(prev => ({
        ...prev,
        travelers: updatedTravelers,
      }));
    } else {
      setBookingDetails(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTraveler = () => {
    setBookingDetails(prev => ({
      ...prev,
      numberOfTravelers: prev.numberOfTravelers + 1,
      travelers: [...prev.travelers, { name: "", email: "", phone: "" }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bookingData = {
        packageId: id,
        userId: userProfile?._id,
        ...bookingDetails,
        totalAmount: (packageData?.price || 0) * bookingDetails.numberOfTravelers,
      };

      const response = await fetch(`/api/confirmation/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingData,
          userId: userProfile?._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSuccessMessage("Booking done! Our team will reach out to you soon.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!packageData || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 font-semibold text-lg">
          Error loading confirmation page
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Image Section */}
        <div className="relative rounded-xl overflow-hidden shadow-xl">
          <Image
            src={packageData.images[0]} 
            alt="Travel Destination" 
            className="w-full h-72 sm:h-96 object-cover"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <h1 className="absolute bottom-8 left-8 text-3xl sm:text-4xl font-bold text-white leading-tight">
            {packageData.name}
          </h1>
        </div>

        {/* Package Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-blue-700  mb-6">Package Details</h2>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Package Name</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{packageData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{packageData.duration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Price per Person</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {packageData.currency} {packageData.price.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available Dates</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {new Date(packageData.availability.startDate).toLocaleDateString()} - 
                {new Date(packageData.availability.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Traveler Information */}
          {bookingDetails.travelers.map((traveler, index) => (
            <div key={index} className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-blue-700  mb-6">
                Traveler {index + 1}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name={`traveler.${index}.name`}
                    value={traveler.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name={`traveler.${index}.email`}
                    value={traveler.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name={`traveler.${index}.phone`}
                    value={traveler.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add More Traveler Button */}
          <button
            type="button"
            onClick={handleAddTraveler}
            className="w-full py-3 bg-blue-500  text-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Add Another Traveler
          </button>

          {/* Emergency Contact */}
          <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-blue-700  mb-6">
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="emergency.name"
                  value={bookingDetails.emergencyContact.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="emergency.phone"
                  value={bookingDetails.emergencyContact.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relation
                </label>
                <input
                  type="text"
                  name="emergency.relation"
                  value={bookingDetails.emergencyContact.relation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-blue-700  mb-6">
              Start Date
            </h2>
            <input
              type="date"
              name="startDate"
              value={bookingDetails.startDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors"
            />
          </div>

          {/* Special Requests */}
          <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-blue-700  mb-6">
              Special Requests
            </h2>
            <textarea
              name="specialRequests"
              value={bookingDetails.specialRequests}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors resize-none"
              placeholder="Any special requirements or requests..."
            ></textarea>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center font-medium">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationPage;