"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { MapPin, Plane } from "lucide-react";

interface Package {
  _id: string;
  name: string;
  images: string[];
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

  if (loading) return (
   
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-6"></div>
          <div className="text-black tracking-widest text-2xl text-center font-mono px-4">
            Hold onn... We Are Fetching the Best Combination of Adventure For You...
          </div>
        </div>
      
  );

  if (error) return (
    <div className="flex justify-center items-center py-10">
      <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
    </div>
  );

  if (destinations.length === 0) return (
    <div className="flex justify-center items-center py-10">
      <p className="text-gray-400 text-lg">No destinations found.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 font-sans text-gray-600">
      <h2 className="text-4xl font-extrabold font-serif tracking-widest text-center text-gray-600 mb-2">
        Explore Destinations With TravelEase
      </h2>

      <div className="space-y-6">
        {destinations.map((destination) => (
          <div
            key={destination._id}
            className="overflow-hidden pt-8 border-b-1.5 border-gray-800 last:border-b-0"
          >
            <img
              src={destination.image}
              alt={destination.city}
              className="w-full h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-3 text-blue-400 mb-3">
                <MapPin className="w-6 h-6 text-blue-400" />
                <h3 className="text-3xl font-bold font-serif tracking-widest text-blue-400">
                  {destination.city}
                </h3>
              </div>
              <p className="text-gray-700 leading-5 text-justify sm:leading-8 sm:text-lg text-sm sm:tracking-tight text-lg">{destination.description}</p>

              {destination.packages && destination.packages.length > 0? (
                <div className="mt-12 pb-8 border-gray-700">
                  <div className="flex items-center gap-3 text-blue-400 mb-6">

                    <Plane className="w-6 h-6" />
                    <h4 className="text-2xl font-semibold text-blue-500">
                      Available Packages in {destination.city}
                    </h4>
                  </div>
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    pagination={{ clickable: true }}
                    modules={[Pagination, Autoplay]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    breakpoints={{
                      640: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                  >
                    {destination.packages.map((pkg) => (
                      <SwiperSlide key={pkg._id}>
                        <Link href={`/packages/${pkg._id}`}>
                          <div className="bg-gray-800 rounded-xl pb-4 overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300">
                            <img
                              src={pkg.images[0]}
                              alt={pkg.name}
                              className="h-48 w-full object-cover"
                            />
                            <div className="p-4 space-y-1">
                              <h5 className="text-lg font-semibold text-white">
                                {pkg.name}
                              </h5>
                              <p className="text-gray-400 text-sm">
                                Price:{" "}
                                <span className="text-green-400 font-medium">
                                  ₹{pkg.price}
                                </span>
                              </p>
                              <p className="text-gray-400 text-sm">
                                Duration: {pkg.duration}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>) : (
                <p className="text-gray-500 text-xl font-bold mt-6">No packages available for this destination.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
