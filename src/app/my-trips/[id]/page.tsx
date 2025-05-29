"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Traveler {
  name: string;
  email: string;
  phone: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface Booking {
  _id: string;
  packageId: {
    name: string;
    places: string;
    images: string[];
    duration: string;
    price: number;
    currency: string;
  };
  userId: {
    name: string;
    email: string;
  };
  numberOfTravelers: number;
  startDate: string;
  specialRequests: string;
  emergencyContact: EmergencyContact;
  travelers: Traveler[];
  totalAmount: number;
}

const MyBookingsPage = () => {
    const params = useParams();

    // Ensure id exists and is string
    const id = params && typeof params.id === "string" ? params.id : null;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/mytrips/${id}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookings();
    }
  }, [id]);

  const toggleExpand = (bookingId: string) => {
    setExpandedBookingId((prev) => (prev === bookingId ? null : bookingId));
  };

  if (loading) return <div className="p-10 text-center text-gray-700">Loading bookings...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!bookings.length) return <div className="p-10 text-center text-gray-700">No bookings found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-12  text-center tracking-widest text-gray-900">My Trips</h1>

      <div className="space-y-8 ">
        {bookings.map((booking) => {
          const formattedDate = new Date(booking.startDate).toLocaleDateString();
          const isExpanded = expandedBookingId === booking._id;

          return (
            <div
            key={booking._id}
            className="bg-white border grid-cols-2 border-gray-300 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => toggleExpand(booking._id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();  // Prevent scroll on Space key
                toggleExpand(booking._id);
              }
            }}
            
            >
              {/* Compact summary header */}
              <div className="flex items-center gap-4 p-4">
                {booking.packageId.images?.[0] && (
                  <img
                    src={booking.packageId.images[0]}
                    alt={booking.packageId.name}
                    className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900">{booking.packageId.name}</h2>
                  <p className="text-sm text-gray-600">
                    {booking.numberOfTravelers} traveler{booking.numberOfTravelers > 1 ? "s" : ""}
                    {" • "}
                    Start: {formattedDate}
                  </p>
                </div>
                <div className="text-right text-gray-700 font-semibold min-w-[100px]">
                  ₹{booking.totalAmount}
                </div>
                <div className="text-gray-500">
                  {isExpanded ? "▲" : "▼"}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-200 px-6 pb-6 pt-2 space-y-6 text-gray-800">
                  {/* Package Info */}
                  <div>
                    <h3 className="text-md font-bold mb-2 flex items-center gap-2">📦 Package Info</h3>
                    <p><strong>Name:</strong> {booking.packageId.name}</p>
                    <p><strong>Places:</strong> {booking.packageId.places}</p>
                    <p><strong>Duration:</strong> {booking.packageId.duration}</p>
                    <p><strong>Price per person:</strong> {booking.packageId.currency} {booking.packageId.price}</p>
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="text-md font-bold mb-2 flex items-center gap-2">👤 User Info</h3>
                    <p><strong>Name:</strong> {booking.userId.name}</p>
                    <p><strong>Email:</strong> {booking.userId.email}</p>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h3 className="text-md font-bold mb-2 flex items-center gap-2">📝 Booking Details</h3>
                    <p><strong>Number of Travelers:</strong> {booking.numberOfTravelers}</p>
                    <p><strong>Start Date:</strong> {formattedDate}</p>
                    <p><strong>Special Requests:</strong> {booking.specialRequests || "None"}</p>
                    <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h3 className="text-md font-bold mb-2 flex items-center gap-2">📞 Emergency Contact</h3>
                    <p><strong>Name:</strong> {booking.emergencyContact.name}</p>
                    <p><strong>Phone:</strong> {booking.emergencyContact.phone}</p>
                    <p><strong>Relation:</strong> {booking.emergencyContact.relation}</p>
                  </div>

                  {/* Travelers */}
                  <div>
                    <h3 className="text-md font-bold mb-4 flex items-center gap-2">🧍 Travelers</h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {booking.travelers.map((traveler, index) => (
                        <div
                          key={index}
                          className="border rounded-lg bg-gray-50 p-3 shadow-sm"
                        >
                          <p><strong>Name:</strong> {traveler.name}</p>
                          <p><strong>Email:</strong> {traveler.email}</p>
                          <p><strong>Phone:</strong> {traveler.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookingsPage;
