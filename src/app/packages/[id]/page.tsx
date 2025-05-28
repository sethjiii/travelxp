"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
  const [newComment, setNewComment] = useState("");
  const [newReview, setNewReview] = useState({ rating: 0, review: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative h-[75vh] w-full overflow-hidden shadow-lg">
        <Image
          src={packageData.images[0] || "/placeholder.jpg"}
          alt={packageData.name}
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold font-serif tracking-widest text-white drop-shadow-lg animate-fade-in">
            {packageData.name}
          </h1>
          <p className="text-lg px-16 tracking-wide leading-relaxed">
            {packageData.description}
          </p>
          {/* <p className="mt-4 text-white/90 text-lg md:text-xl max-w-2xl animate-fade-in delay-150">
            {packageData.description}
          </p> */}

          <div className="mt-6 flex flex-wrap justify-center gap-4 animate-fade-in delay-300">
            {/* Duration Badge */}
            <div className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-blue-500/30 to-blue-800/30 text-white border border-white/20 backdrop-blur-md rounded-full shadow-md transition-transform hover:scale-105 hover:shadow-lg">
              <span className="text-xl">⏱</span>
              <span className="text-sm md:text-base font-medium">{packageData.duration}</span>
            </div>
            {/* Price Badge */}
            <div className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-green-500/30 to-green-800/30 text-white border border-white/20 backdrop-blur-md rounded-full shadow-md transition-transform hover:scale-105 hover:shadow-lg">
              <span className="text-xl">💰</span>
              <span className="text-sm md:text-base font-medium">
                Rs. {packageData.price}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Package Actions */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-md text-white transition-colors duration-300
              ${packageData.isLiked ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {packageData.isLiked ? "Unlike" : "Like"} ({packageData.likes})
          </button>
          <button
            onClick={handleBookNow}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Book Now
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-800">
            Rating: {(packageData.rating || 0).toFixed(1)} ⭐
          </span>
          <span className="text-sm text-gray-500">
            {packageData.reviews.length} Reviews
          </span>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-300">
        <nav className="flex flex-wrap justify-center gap-6">
          {["overview", "itinerary", "gallery", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-base font-sans font-bold uppercase transition-all duration-300
          ${activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            >
              {tab}
              {/* Underline */}
              <span
                className={`absolute left-1/2 -bottom-0.5 h-0.5 bg-blue-600 transition-all duration-300 ease-out
            ${activeTab === tab ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"}`}
              />
            </button>
          ))}
        </nav>
      </div>

      
      {/* Overview Content */}
      {(activeTab === "overview") && (
      <div className="space-y-8">
        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-4xl tracking-wide font-sans font-bold text-blue-600 mb-4">Description</h2>
          <p className="text-gray-700 text-lg tracking-wide leading-relaxed">
            {packageData.description}
          </p>
        </div>

        {/* Highlights */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packageData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-md hover:shadow transition"
              >
                <span className="text-blue-500 text-xl">📍</span>
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-600 mb-4">What's Included</h2>
            <ul className="space-y-3 text-gray-700">
              {packageData.inclusions.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-500 mb-4">What's Not Included</h2>
            <ul className="space-y-3 text-gray-700">
              {packageData.exclusions.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Availability</h2>
          <div className="flex flex-wrap gap-8 items-center text-gray-700">
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

            {/* Status */}
            {new Date(packageData.availability.startDate) <= new Date() &&
              new Date(packageData.availability.endDate) >= new Date() ? (
              <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                Currently Available
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                Not Available
              </span>
            )}
          </div>

          {/* Book Now CTA */}
          {new Date(packageData.availability.startDate) <= new Date() &&
            new Date(packageData.availability.endDate) >= new Date() && (
              <button
                onClick={handleBookNow}
                className="mt-6 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Book Now
              </button>
            )}
        </div>
        </div>
        )}
        {/* Itinerary Tab */}
        <div>
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
                      className={`text-2xl ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
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
                              className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"
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