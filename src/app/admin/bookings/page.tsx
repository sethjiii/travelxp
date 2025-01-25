"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const BookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/admin/bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming token is stored in localStorage
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Something went wrong!");
        }
      } catch (error) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600">Bookings</h1>

      {loading ? (
        <div className="text-center">Loading bookings...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="mt-6">
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">User Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">Package Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">Start Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">Number of Travelers</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">Total Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">{booking.user?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">{booking.package?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">{booking.startDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">{booking.numberOfTravelers}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">{booking.totalAmount}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 border-b">
                        <Link
                          href={`/admin/bookings/${booking._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center inline-block"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No bookings available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
