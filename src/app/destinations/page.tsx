"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Package {
  _id: string;
  name: string;
  image: string;
  price: number;
  duration: string;
}

interface Destination {
  _id: string;
  city: string;
  description: string;
  image: string;
  packages?: Package[];
}

export default function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
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
        <p className="text-gray-400 text-lg">Loading destinations...</p>
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
        <p className="text-gray-400 text-lg">No destinations found.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h2 className="text-4xl font-extrabold text-center text-blue-300 mb-12">
        Explore Destinations
      </h2>
      <div className="space-y-20">
        {destinations.map((destination) => (
          <div
            key={destination._id}
            className="bg-gray-900 rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={destination.image}
              alt={destination.city}
              className="w-full h-72 object-cover"
            />
            <div className="p-6">
              <h3 className="text-3xl font-bold text-blue-400">
                {destination.city}
              </h3>
              <p className="mt-4 text-gray-300">{destination.description}</p>

              {destination.packages && destination.packages.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-2xl font-semibold text-white mb-4">
                    Popular Packages
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {destination.packages.slice(0, 4).map((pkg) => (
                        <Link href={`/packages/${pkg._id}`}>
                        
                      <div
                        key={pkg._id}
                        className="bg-gray-800 hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
                      >
                        <div className="relative">
                          <img
                            src={pkg.images[0]}
                            alt={pkg.name}
                            className="h-40 w-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <h5 className="text-lg font-semibold text-white">
                              {pkg.name}
                            </h5>
                          </div>
                        </div>
                        <div className="p-4 text-sm text-gray-300">
                          <p>Price: <span className="text-green-400 font-semibold">₹{pkg.price}</span></p>
                          <p>Duration: {pkg.duration}</p>
                        </div>
                      </div>
                        </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
