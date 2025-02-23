"use client"
import React, { useState, useEffect } from "react";
import { DollarSign, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define the structure of a package
interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  images: string[];
}

const AllPackagesPage = () => {
  // State for search input and fetched packages
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages from the backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        const data = await response.json();
        setPackages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter packages based on search query
  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Search Box */}
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="Search for a package..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Loading Spinner */}
      {loading && <div>Loading...</div>}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
        <Link href={`/packages/${pkg._id}`} key={pkg._id}>
          <div
            
            className="overflow-hidden rounded-lg shadow-lg bg-white"
          >
            <div className="relative h-48">
              <Image
                src={pkg.images[0]}
                alt={pkg.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{pkg.name}</h2>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-green-600" />
                  <span>
                    {pkg.currency} {pkg.price}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500" />
                  <span>{pkg.rating}</span>
                </div>
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>

      {/* No Results Found */}
      {filteredPackages.length === 0 && (
        <div className="text-center text-gray-600">
          <p>No packages found for &quot;{searchQuery}&quot;.</p>
        </div>
      )}
    </div>
  );
};

export default AllPackagesPage;
