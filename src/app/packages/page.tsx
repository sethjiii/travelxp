"use client"
import React, { useState, useEffect } from "react";
import { ArrowRight, Bookmark, IndianRupee, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StarHalf, StarOff } from "lucide-react";

// Define the structure of a package
interface Package {
  _id: string;
  name: string;
  duration: string;
  places: string;
  description: string;
  //price: number;
  //currency: string;
  rating: number;
  images: string[];
}

const AllPackagesPage = () => {
  // State for search input and fetched packages
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);


  // ⭐ Star rendering logic
  const renderStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400 w-4 h-4" fill="currentColor" />);
    }

    if (hasHalf && fullStars < 5) {
      stars.push(<StarHalf key="half" className="text-yellow-400 w-4 h-4" fill="currentColor" />);
    }

    while (stars.length < 5) {
      stars.push(<StarOff key={`off-${stars.length}`} className="text-yellow-400 w-4 h-4" />);
    }

    return stars;
  };


  // Fetch packages from the backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        const data = await response.json();
        setPackages(data.packages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleAddToWishlist = (id: string) => {
    // Replace with actual logic to save to wishlist
    console.log(`Adding package ${id} to wishlist`);
    // Maybe call an API or update local state
  };

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

      {loading && (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-6"></div>
    <div className="text-black tracking-widest text-2xl text-center font-mono px-4">
      Hold onn... We Are Fetching the Best Combination of Luxury Travel For You...
    </div>
  </div>
)}



      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 bg-gray-200  gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg._id}>
            <div

              className="overflow-hidden  shadow-l text-gray-800  hover:shadow-2xl  transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={pkg.images[0]}
                  alt={pkg.name}
                  width={200}
                  height={300}
                  className="w-full h-full object-fill"
                />
              </div>
              <div className="p-4">
                <h6 className="text-sm text-gray-500 tracking-wide">{pkg.duration}</h6>
                <div className="flex">
                  <div className="flex justify-between items-end w-full mt-auto pt-1">
                    <h2 className="text-2xl  font-semibold font-sans tracking-wider">{pkg.name}</h2>

                    {/* <div className="flex items-center text-yellow-600  text-2xl font-bold tracking-wide">
                      <IndianRupee className="text-xl" />
                      <span>{pkg.price}</span>
                    </div> */}
                  </div>

                </div>
                <div className="flex flex-wrap text-xs text-gray-500 mt-2 mb-2">

                  {pkg.places.split("-").map((place, index, arr) => (
                    <span key={index} className="flex items-center tracking-wide">
                      <span>{place}</span>
                      {index < arr.length - 1 && <ArrowRight className="mx-1 w-4 h-6 opacity-25" />}
                    </span>
                  ))}
                </div>

                <div className="flex  flex-wrap gap-6 mt-4 items-center">
                {/* ⭐ Star Rating Section */}
                  <div className="flex items-center gap-1 mr-auto">
                    {renderStars(pkg.rating)}
                    <span className="text-sm font-bold  text-gray-900 tracking-widest ">
                      {(pkg.rating ?? 4.5).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 ml-4 sm:gap-2">
                  <Link
                    href={`/packages/${pkg._id}`}
                    className="w-fit min-w-[120px] rounded-md hover:bg-blue-700 flex items-center justify-center gap-1 border border-blue-500 text-blue-500 font-semibold tracking-wide hover:text-white py-1.5 px-3 text-sm transition"
                  >
                    Explore Now
                  </Link>
                  <button
                    onClick={() => handleAddToWishlist(pkg._id)}
                    className="w-fit min-w-[120px] rounded-md hover:bg-green-700 flex items-center justify-center gap-1 border border-green-500 text-green-500 font-semibold tracking-wide hover:text-white py-1.5 px-3 text-sm transition"
                  >
                    <Bookmark className="w-4 h-4" />
                    Wishlist
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Found */}
      {filteredPackages.length === 0 && (
        <div className="text-center text-gray-600">
          {!loading&&<p>No packages found for &quot;{searchQuery}&quot;.</p>}
        </div>
      )}
    </div>
  );
};

export default AllPackagesPage;
