"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Heart,
  Clock,
  Compass,
  ArrowRight,
  Award,
  Star,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TravelPackage {
  _id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  highlights: string[];
  images: string[];
  likes: number;
  destination: string;
  name: string;
}

interface Testimonial {
  id: number;
  name: string;
  image: string;
  comment: string;
  rating: number;
  destination: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "r1.jpeg",
    comment: "The best travel experience I've ever had! The attention to detail was amazing.",
    rating: 5,
    destination: "Japan Tour"
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "r2.jpeg",
    comment: "Perfectly organized trip with unforgettable moments. Highly recommended!",
    rating: 5,
    destination: "Italy Adventure"
  },
  {
    id: 3,
    name: "Emma Davis",
    image: "r3.jpeg",
    comment: "Professional service and incredible destinations. Will definitely book again!",
    rating: 5,
    destination: "Greece Explorer"
  }
];

const TravelContent = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [sortBy, setSortBy] = useState<string>("popularity");

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        console.log(data)
        setPackages(data.packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const popularPackages = [...packages]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);
    console.log(popularPackages)
    fetchPackages();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) throw new Error('Subscription failed');
      
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error(error as string || "Failed to subscribe. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const filterPackages = (packages: TravelPackage[]) => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.highlights.some((highlight) =>
          highlight.toLowerCase().includes(searchQuery.toLowerCase())
        );

      let matchesPrice = true;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        matchesPrice = pkg.price >= min && (max ? pkg.price <= max : true);
      }

      return matchesSearch && matchesPrice;
    });
  };

  const popularPackages = [...packages].sort((a, b) => b.likes - a.likes).slice(0, 6);
  const featuredPackages = filterPackages(packages).slice(0, 6);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Hero Section */}
      <section className="relative h-[600px] overflow-hidden mb-16">
        <img
          src="11.jpeg"
          alt="Travel Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="text-white px-8 md:px-16 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Explore curated travel experiences tailored to your preferences
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
                Explore Now
              </button>
              <Link
                href="/packages"
                className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-blue-200 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Why Travel With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="h-8 w-8" />,
                title: "Best Price Guarantee",
                description: "We offer unbeatable prices for premium travel experiences"
              },
              {
                icon: <Compass className="h-8 w-8" />,
                title: "Expert Guides",
                description: "Professional local guides to enhance your journey"
              },
              {
                icon: <PhoneCall className="h-8 w-8" />,
                title: "24/7 Support",
                description: "Round-the-clock assistance for peace of mind"
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Curated Experiences",
                description: "Handpicked destinations and activities"
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-blue-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl text-gray-700 font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 font-sans">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-20 bg-gradient-to-b from-blue-200 to-blue-50 px-5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Featured Packages
            </h2>
            <Link
              href="/packages"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Enhanced Search and Filter Bar */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative col-span-2">
                <input
                  type="text"
                  placeholder="Search destinations or packages..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Price Range Filter */}
              <select
                className="py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="0-1000">Under $1,000</option>
                <option value="1001-2000">$1,001 - $2,000</option>
                <option value="2001-3000">$2,001 - $3,000</option>
                <option value="3001">Above $3,000</option>
              </select>

              {/* Sort By */}
              <select
                className="py-3 px-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-1 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {priceRange !== "all" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                  Price: {priceRange}
                  <button
                    onClick={() => setPriceRange("all")}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Package Grid */}
          <section className="mb-16 px-4 md:px-8 lg:px-12">
  {/* <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
    Featured Packages
  </h2> */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {featuredPackages.map((pkg) => (
      <div
        key={pkg._id}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
      >
        {/* Image Section */}
        <div className="relative">
          <img
            src={pkg.images[0]}
            alt={pkg.title}
            className="w-full h-48 object-cover"
          />
          <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all">
            <Heart className="h-5 w-5 text-red-500" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pkg.highlights.map((highlight, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-blue-500" />
                {highlight}
              </span>
            ))}
          </div>

          {/* Price and Duration */}
          <div className="flex items-center justify-between text-gray-800 mb-4">
            <span className="text-blue-600 font-bold text-xl">
              ${pkg.price}
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-5 w-5 text-gray-400" />
              {pkg.duration}
            </span>
          </div>

          {/* View Details Button */}
          <Link href={`/packages/${pkg._id}`}className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View Details
            
          </Link>
        </div>
      </div>
    ))}
  </div>
</section>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-blue-100 to-white px-5">
  <div className="container mx-auto px-4">
    {/* Header */}
    <div className="flex justify-between items-center mb-12">
      <h2 className="text-4xl font-bold text-gray-800">Popular Destinations</h2>
      <Link
        href="/packages"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        Explore All <ArrowRight className="h-5 w-5" />
      </Link>
    </div>

    {/* Destination Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {popularPackages.map((pkg) => (
    <div
      key={pkg._id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="w-full h-36 object-cover"
        />
        <button className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow hover:bg-white transition-all">
          <Heart className="h-4 w-4 text-red-500" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">
          {pkg.name}
        </h3>

        {/* Destination */}
        <p className="flex items-center gap-1 text-gray-600 text-xs mb-2">
          <MapPin className="h-3 w-3 text-blue-500" />
          {pkg.highlights[0]}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between text-gray-800 mb-2">
          <span className="text-blue-600 font-bold text-sm">
            ${pkg.price}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-4 w-4 text-gray-400" />
            {pkg.duration}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          href={`/packages/${pkg._id}`}
          className="block w-full text-center bg-blue-600 text-white text-xs py-1 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  ))}
</div>

  </div>
</section>



      {/* Testimonials Section */}
     <section className="py-12 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
      What Our Travelers Say
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-blue-400 text-sm truncate">{testimonial.name}</h3>
              <p className="text-gray-600 text-xs truncate">{testimonial.destination}</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-3 line-clamp-3">
            {testimonial.comment}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Enhanced Newsletter Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 transform -skew-y-6"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Get Exclusive Travel Updates
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Subscribe to our newsletter and receive exclusive offers, travel tips, and destination guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-6 py-4 rounded-full text-gray-900 flex-grow max-w-md text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg font-semibold disabled:opacity-70"
              >
                {subscribing ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>
            <p className="mt-4 text-sm text-blue-100">
              By subscribing, you agree to receive our marketing emails. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelContent;