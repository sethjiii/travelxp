"use client";
import React, { useEffect, useState } from "react";

interface Destination {
  _id: string;
  city: string;
  description: string;
  packages?: string[];
  images?: string[];
}

export default function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) {
          throw new Error("Failed to fetch destinations");
        }
        const data = await res.json();
        setDestinations(data.destinations || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600 text-lg">Loading destinations...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  if (destinations.length === 0)
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600 text-lg">No destinations found.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 border-b-2 border-blue-300 pb-2">
        Destinations
      </h2>
      <ul className="space-y-10">
        {destinations.map((dest) => (
          <li
            key={dest._id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">
              {dest.city}
            </h3>
            <p className="text-gray-700 mb-4">{dest.description}</p>

            {dest.packages && dest.packages.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-blue-700 mb-2">Packages:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {dest.packages.map((pkg, idx) => (
                    <li key={idx}>{pkg}</li>
                  ))}
                </ul>
              </div>
            )}

            {dest.images && dest.images.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {dest.images.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`${dest.city} image ${idx + 1}`}
                    className="w-48 h-32 object-cover rounded-md shadow-sm hover:scale-105 transform transition-transform duration-300 cursor-pointer"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
