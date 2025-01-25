"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, User, Package, Calendar, Phone, Star, MapPin } from "lucide-react";

interface Booking {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  package: {
    name: string;
    description: string;
    price: number;
    itinerary: ItineraryItem[];
    reviews: Review[];
  };
  startDate: string;
  numberOfTravelers: number;
  totalAmount: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface ItineraryItem {
  _id: string;
  day: number;
  title: string;
  description: string;
  stay: string;
  activities: Activity[];
}

interface Activity {
  name: string;
  time: string;
  additionalDetails: string;
}

interface Review {
  _id: string;
  username: string;
  rating: number;
  review: string;
  createdAt: string;
}

const BookingDetailsPage = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const bookingId = params?.id;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      try {
        const response = await fetch(`/api/admin/bookings/${bookingId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Something went wrong!");
        }
      } catch (error) {
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const Section = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: React.ComponentType }) => (
    <div className="mb-6">
      <div className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
            <div className="w-6 h-6 text-blue-600">
          <Icon  />
            </div>
                
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
      </div>
      <div className="mt-4 p-6 bg-white rounded-lg shadow-lg animate-fadeIn">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-2xl text-blue-600">Loading details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">No details available for this booking.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Booking Details</h1>

        <Section title="User Information" icon={User}>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard label="Name" value={booking.user?.name} />
            <InfoCard label="Email" value={booking.user?.email} />
            <InfoCard label="Phone" value={booking.user?.phone} />
          </div>
        </Section>

        <Section title="Package Details" icon={Package}>
          <div className="space-y-4">
            <InfoCard label="Package Name" value={booking.package?.name} />
            <InfoCard label="Description" value={booking.package?.description} />
            <InfoCard label="Price" value={`₹${booking.package?.price}`} />
          </div>
        </Section>

        <Section title="Booking Information" icon={Calendar}>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard label="Start Date" value={new Date(booking.startDate).toLocaleDateString()} />
            <InfoCard label="Number of Travelers" value={booking.numberOfTravelers} />
            <InfoCard label="Total Amount" value={`₹${booking.totalAmount}`} />
          </div>
        </Section>

        <Section title="Emergency Contact" icon={Phone}>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard label="Name" value={booking.emergencyContact?.name} />
            <InfoCard label="Phone" value={booking.emergencyContact?.phone} />
            <InfoCard label="Relation" value={booking.emergencyContact?.relation} />
          </div>
        </Section>

        <Section title="Itinerary" icon={MapPin}>
          <div className="space-y-6">
            {booking.package?.itinerary?.map((item, index) => (
              <div key={item._id || index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Day {item.day}: {item.title}
                </h3>
                <p className="text-gray-700 mb-2">{item.description}</p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Stay:</span> {item.stay}
                </p>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Activities:</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.isArray(item.activities) && item.activities.length > 0 ? (
                      item.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="p-3 bg-white rounded shadow-sm">
                          <p className="font-medium text-blue-600">{activity.name}</p>
                          <p className="text-gray-600">{activity.time}</p>
                          <p className="text-gray-600">{activity.additionalDetails}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No activities listed</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Reviews" icon={Star}>
          <div className="space-y-4">
            {booking.package?.reviews?.length ? (
              booking.package.reviews.map((review, index) => (
                <div key={review._id || index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-800">{review.username}</span>
                    <div className="ml-4 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews available.</p>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-lg text-gray-800">{value || "N/A"}</p>
  </div>
);

export default BookingDetailsPage;
