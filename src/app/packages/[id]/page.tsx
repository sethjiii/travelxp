"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {  CalendarArrowDown, CalendarArrowUp, Check, CheckCircle, ListCheck,  ListXIcon, Rocket, Sparkles, User, X } from "lucide-react";

// Interfaces remain the same as your original code
type Availability = {
  startDate: string;
  endDate: string;
};



interface Activity {
  name: string;
  time: string;
  additionalDetails: string;
}

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  stay: string;
  activities: Activity[];
}

interface Review {
  username: string;
  rating: number;
  review: string;
  createdAt: string;
}

// type NewReview = {
//   rating: number;
//   review: string;
// };


interface Comment {
  username: string;
  comment: string;
  createdAt: string;
}

interface TravelPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  images: string[];
  rating: number;
  reviews: Review[];
  comments: Comment[];
  likes: number;
  isLiked: boolean;
  index: number;
  item: string;
  exclusions: string[];
  inclusions: string[];
  availability: Availability;
}

const TravelPackageDisplay = () => {
  const params = useParams();
  const id = params?.id as string;

  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  // const [newComment, setNewComment] = useState("");
  const [newReview, setNewReview] = useState({ rating: 0, review: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter()
  useEffect(() => {
    const fetchPackageData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/packages/${id}`);
        const data = await response.json();
        setPackageData(data);
      } catch (error) {
        console.error("Error fetching travel package data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [id]);

  const handleBookNow = () => {
    router.push(`/confirmation/${id}`); // Redirect to confirmation page
  };


  // const handleLike = async () => {
  //   if (!packageData) return;
  //   try {
  //     const response = await fetch(`/api/packages/${id}/like`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (response.ok) {
  //       setPackageData(prev => prev ? {
  //         ...prev,
  //         likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
  //         isLiked: !prev.isLiked
  //       } : null);
  //     }
  //   } catch (error) {
  //     console.error("Error liking package:", error);
  //   }
  // };

  // const handleComment = async () => {
  //   if (!newComment.trim() || !packageData) return;
  //   setIsSubmitting(true);
  //   try {
  //     const response = await fetch(`/api/packages/${id}/comments`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ comment: newComment }),
  //     });
  //     if (response.ok) {
  //       const newCommentData = await response.json();
  //       setPackageData(prev => prev ? {
  //         ...prev,
  //         comments: [...prev.comments, newCommentData]
  //       } : null);
  //       setNewComment("");
  //     }
  //   } catch (error) {
  //     console.error("Error posting comment:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  useEffect(() => {
    if (packageData) {
      setVisibleReviews(packageData.reviews.slice(0, 5));
    }
  }, [packageData]);

  const handleReview = async () => {
    if (!newReview.review.trim() || !newReview.rating || !packageData) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/packages/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (response.ok) {
        const newReviewData = await response.json();
        setPackageData(prev => prev ? {
          ...prev,
          reviews: [...prev.reviews, newReviewData],
          rating: (prev.rating * prev.reviews.length + newReview.rating) / (prev.reviews.length + 1)
        } : null);
        setNewReview({ rating: 0, review: "" });
      }
    } catch (error) {
      console.error("Error posting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Package not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl bg-blue-50  mx-auto">
      {/* Hero Section */}
      <div className="relative h-[65vh] w-full overflow-hidden shadow-lg">
        {/* Background Image */}
        <Image
          src={packageData.images[0] || "/placeholder.jpg"}
          alt={packageData.name}
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />

        {/* Gradient Overlay */}
        <div className=" inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

        {/* Center Content */}
        <div className="absolute inset-0 z-20 flex flex-col text-justify items-center">
          <h1 className="sm:pt-16 pt-12 pb-2 sm:pb-8 text-4xl text-justify md:text-6xl font-extrabold font-serif tracking-widest text-white drop-shadow-lg animate-fade-in">
            {packageData.name}
          </h1>
          <p className="sm:text-lg text-sm font-bold leading-5 tracking-normal sm:tracking-wide px-6 sm:px-12 sm:leading-relaxed text-white animate-fade-in delay-150">
            {packageData.description}
          </p>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 animate-fade-in delay-300">
            <div className="flex items-center gap-2 sm:px-5 px-2 sm:py-2 py-0 bg-gradient-to-br from-blue-500/30 to-blue-800/30 text-white border border-white/20 backdrop-blur-md rounded-full shadow-md transition-transform hover:scale-105 hover:shadow-lg">
              <span className="text-xl">⏱</span>
              <span className="text-sm md:text-base sm:font-medium">{packageData.duration}</span>
            </div>
            <div className="flex items-center gap-2 sm:px-5 sm:py-2 px-2 py-0 bg-gradient-to-br from-green-500/30 to-green-800/30 text-white border border-white/20 backdrop-blur-md rounded-full shadow-md transition-transform hover:scale-105 hover:shadow-lg">
              <span className="text-xl">💰</span>
              <span className="text-sm md:text-base font-medium">Rs. {packageData.price}</span>
            </div>
          </div>
        </div>

        {/* Review & Book Now Section - Bottom Full Width with Background Image */}
        <div className="absolute bottom-0 items-center left-0 w-full h-16 z-30">
          <div className="flex items-start sm:items-center justify-between w-full px-4 sm:px-6 py-4 backdrop-blur-sm text-white gap-4 sm:gap-0">
            <div className="flex items-start sm:items-center gap-1 sm:gap-4">
              <span className="text-base sm:text-lg font-semibold">
                {(packageData.rating || 0).toFixed(1)} ⭐
              </span>
              <span className="text-sm flex items-center text-gray-200">
                <User className="text-blue-400 text-sm" />{packageData.reviews.length}
              </span>
            </div>
            <button
              onClick={handleBookNow}
              className="w-fit min-w-[120px] rounded-md hover:bg-green-700 flex items-center justify-center gap-1 border bg-white border-green-500 text-green-500 font-semibold tracking-wide hover:text-white py-1.5 px-3 text-sm sm:px-10 sm:text-lg sm:py-2 transition"
            >
              Book Now
            </button>
          </div>
        </div>

      </div>
      {/* Availability Bar */}
      <div className="flex sm:flex-nowrap items-center justify-between gap-4 sm:gap-6 bg-blue-50 px-4 sm:px-6 py-3 border border-blue-200 shadow-sm text-sm sm:text-base">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-12 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <CalendarArrowUp className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
            <p className="text-gray-500">Start:</p>
            <p className="font-medium text-gray-800">
              {new Date(packageData.availability.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <CalendarArrowDown className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
            <p className="text-gray-500">End:</p>
            <p className="font-medium text-gray-800">
              {new Date(packageData.availability.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {new Date(packageData.availability.startDate) <= new Date() &&
            new Date(packageData.availability.endDate) >= new Date() ? (
            <span className="px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-green-200 text-green-700 font-medium text-xs sm:text-sm flex text-center items-center gap-1">
              Currently Available
            </span>
          ) : (
            <span className="px-3 sm:px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-medium text-xs sm:text-sm flex items-center gap-1">
              Not Available
            </span>
          )}
        </div>
      </div>


      {/* Tabs Navigation */}
      <div className="py-2 border-gray-300" >
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-8">
          {["overview", "itinerary", "gallery", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-sm sm:text-md font-sans font-medium sm:font-bold sm:tracking-wider uppercase transition-all duration-300
        ${activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            >
              {tab}
              <span
                className={`absolute left-1/2 -bottom-0.5 h-0.5 bg-blue-600 transition-all duration-300 ease-out
          ${activeTab === tab ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"}`}
              />
            </button>
          ))}
        </nav>
        <hr className="w-auto bg-blue-600 mx-auto my-2 rounded" />
      </div>

      {activeTab === "overview" && (
        <div className="bg-blue-100 rounded-2xl shadow p-6 md:p-8 grid md:grid-cols-3 gap-8 items-start">
          {/* Highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-xl tracking-wide font-bold">Highlights</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packageData.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 hover:shadow-sm transition"
                >
                  <Rocket className="text-blue-500 w-5 h-5" />
                  <span className="text-gray-700 capitalize font-sans tracking-wide text-sm">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div>
            <div className="flex items-center gap-2 text-green-600">
              <ListCheck className="w-5 h-5" />
              <h2 className="text-lg font-semibold tracking-wide">What&apos;s Included</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {packageData.inclusions.map((item, index) => (
                <li key={index} className="flex capitalize items-center font-sans tracking-wide gap-2 text-gray-700 text-sm">
                  <Check className="text-green-500 w-4 h-4" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div>
            <div className="flex items-center gap-2 text-red-500">
              <ListXIcon className="w-5 h-5" />
              <h2 className="text-lg tracking-wide font-semibold">What&apos;s Not Included</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {packageData.exclusions.map((item, index) => (
                <li key={index} className="flex items-center gap-2 font-sans tracking-wide capitalize text-gray-700 text-sm">
                  <X className="text-red-500 w-4 h-4" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Itinerary Tab */}
      <div>
        {activeTab === "itinerary" && (
          <div className="p-6 pb-0 rounded-lg shadow-md">
            <h2 className="text-4xl  font-sans font-semibold tracking-widest text-blue-600 mb-6">Journey Timeline</h2>
            <div className="space-y-8">
              {packageData.itinerary.map((day, index) => (
                <div key={index} className="relative pl-8 pb-8">
                  {/* Timeline line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-200"></div>

                  {/* Timeline dot */}
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>

                  <div className="bg-blue-100 rounded-lg border-2 border-blue-100 shadow-blue-200 shadow-md p-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                      <h3 className="text-xl font-semibold text-blue-600 font-sans tracking-wide capitalize">Day {day.day}: {day.title}</h3>
                      <span className="px-3 py-2 capitalize bg-blue-500 font-sans tracking-wide text-blue-50 rounded-full text-sm">
                        {day.stay}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{day.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.activities.map((activity, actIndex) => (
                        <div
                          key={actIndex}
                          className="flex flex-col md:flex-row md:items-center gap-4 px-4 pl-0 py-0 bg-blue-50 rounded-lg"
                        >
                          <div className="md:w-1/6">
                            <span className="inline-block px-3 py-3 bg-blue-500 font-bold font-sans tracking-wide text-blue-50 uppercase rounded-l-md text-sm">
                              {activity.time}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-600 font-sans tracking-wider">{activity.name}</h4>
                            {activity.additionalDetails && (
                              <p className="text-sm font-sans tracking-wide text-gray-700 mt-1">
                                {activity.additionalDetails}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className=" p-6 shadow-md">
            <h2 className="text-4xl font-semibold text-blue-600 font-sans tracking-wider mb-6">Photo Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packageData.images.map((image, index) => (
                <div key={index} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image}
                    alt={`${packageData.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 hover:opacity-90 transition-transform duration-300"
                    fill
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Review Form */}
            <div className="bg-blue-100 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 font-sans tracking-wide text-blue-600">Rate this Package</h2>

              {/* Star Rating and Submit */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star: number) => (
                    <button
                      key={star}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className={`text-3xl transition-colors duration-150 ${star <= newReview.rating ? "text-yellow-400" : "text-white"
                        }`}
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleReview}
                  disabled={isSubmitting || !newReview.rating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 tracking-widest h-4" />
                  Submit
                </button>
              </div>

              {/* Optional Description */}
              <textarea
                value={newReview.review}
                onChange={(e) =>
                  setNewReview(prev => ({ ...prev, review: e.target.value }))
                }
                placeholder="(Optional) Share your thoughts..."
                className="w-full mt-4 p-3 border border-gray-300 font-sans bg-blue-50 tracking-wide text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            {/* Past Reviews */}
            <div className="bg-blue-100 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-blue-500 font-sans tracking-wide mb-4">
                Reviews ({packageData.reviews.length})
              </h2>

              {/* Scrollable Container */}
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {visibleReviews.map((review: Review, index: number) => (
                  <div key={index} className="border-b last:border-0 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-medium text-gray-800">{review.username}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.review && (
                      <p className="text-gray-600">{review.review}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {visibleReviews.length < packageData.reviews.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() =>
                      setVisibleReviews(prev => [
                        ...prev,
                        ...packageData.reviews.slice(prev.length, prev.length + 5)
                      ])
                    }
                    className="px-4 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPackageDisplay;