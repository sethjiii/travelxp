"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {useRouter} from "next/navigation";
import Image from "next/image";

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
    index:number;
    item:string;
    exclusions:string[];
    inclusions:string[];
    availability:Availability;
  }

  

const TravelPackageDisplay = () => {
  const params = useParams();
  const id = params?.id as string;

  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newReview, setNewReview] = useState({ rating: 0, review: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const router=useRouter()
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


  const handleLike = async () => {
    if (!packageData) return;
    try {
      const response = await fetch(`/api/packages/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setPackageData(prev => prev ? {
          ...prev,
          likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
          isLiked: !prev.isLiked
        } : null);
      }
    } catch (error) {
      console.error("Error liking package:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !packageData) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/packages/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });
      if (response.ok) {
        const newCommentData = await response.json();
        setPackageData(prev => prev ? {
          ...prev,
          comments: [...prev.comments, newCommentData]
        } : null);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Hero Section */}
      <div className="relative h-[60vh] rounded-xl overflow-hidden">
        <Image 
          src={packageData.images[0]} 
          alt={packageData.name}
          className="w-full h-full object-cover"
          width={100}
          height={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{packageData.name}</h1>
          <p className="text-xl text-white/90 mb-6">{packageData.description}</p>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 bg-white/20 rounded-full text-white backdrop-blur-sm">
              {packageData.duration}
            </span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-white backdrop-blur-sm">
              {packageData.currency} {packageData.price}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{packageData.duration}</p>
            </div>
            <span className="text-blue-600">⏱</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">{packageData.currency} {packageData.price}</p>
            </div>
            <span className="text-green-600">💰</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-medium">{packageData.rating} / 5.0</p>
            </div>
            <span className="text-yellow-500">⭐</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <button 
            onClick={handleLike}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-md
                     transition-colors duration-200
                     ${packageData.isLiked 
                       ? "bg-blue-600 text-white" 
                       : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
          >
            {packageData.isLiked ? "❤️" : "🤍"} {packageData.likes} Likes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-4">
          {["overview", "itinerary", "gallery", "reviews"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors duration-200
                        ${activeTab === tab
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Highlights */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl text-blue-600 font-semibold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 text-gray-600  md:grid-cols-2 gap-4">
                {packageData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-blue-500">📍</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl text-blue-600  font-semibold mb-4">What&apos;s Included</h2>
                <ul className="space-y-2 text-gray-600 ">
                  {packageData.inclusions.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-600  mb-4">What&apos;s Not Included</h2>
                <ul className="space-y-2 text-gray-600 ">
                  {packageData.exclusions.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-red-500">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white text-blue-600 p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Availability</h2>
  <div className="flex flex-wrap gap-6">
    <div>
      <p className="text-sm text-gray-500">Start Date</p>
      <p className="font-medium">
        {new Date(packageData.availability.startDate).toLocaleDateString()}
      </p>
    </div>
    <div>
      <p className="text-sm text-gray-500">End Date</p>
      <p className="font-medium">
        {new Date(packageData.availability.endDate).toLocaleDateString()}
      </p>
    </div>
  </div>

  {/* Check if the package is available */}
  {new Date(packageData.availability.startDate) <= new Date() &&
   new Date(packageData.availability.endDate) >= new Date() && (
    <button
      onClick={handleBookNow}
      className="mt-4 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Book Now
    </button>
  )}
</div>

          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Journey Timeline</h2>
            <div className="space-y-8">
              {packageData.itinerary.map((day, index) => (
                <div key={index} className="relative pl-8 pb-8">
                  {/* Timeline line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-200"></div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                      <h3 className="text-xl font-semibold">Day {day.day}: {day.title}</h3>
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {day.stay}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6">{day.description}</p>
                    
                    <div className="space-y-4">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} 
                             className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="md:w-1/6">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {activity.time}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.name}</h4>
                            {activity.additionalDetails && (
                              <p className="text-sm text-gray-600 mt-1">
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Photo Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packageData.images.map((image, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={image} 
                    alt={`${packageData.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    fill
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Add Review */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl ${
                        star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ⭐
                    </button>))}
                </div>
                <textarea
                  value={newReview.review}
                  onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Share your experience..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
                <button
                  onClick={handleReview}
                  disabled={isSubmitting || !newReview.rating || !newReview.review.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Post Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Reviews ({packageData.reviews.length})
              </h2>
              <div className="space-y-6">
                {packageData.reviews.map((review, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{review.username}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Comments ({packageData.comments.length})
              </h2>
              <div className="space-y-4 mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Leave a comment..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <button
                  onClick={handleComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
              <div className="space-y-4">
                {packageData.comments.map((comment, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{comment.username}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPackageDisplay;