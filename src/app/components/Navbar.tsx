"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Globe, Menu, X, Search, User, Phone } from "lucide-react";
import { useAuth } from "../../Auth/AuthProvider"; // Import the custom Auth hook
import Image from "next/image";

const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  console.log("from navbar");
  console.log(user?.role);


  // Ensures client-side only logic
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: "Destinations", icon: <MapPin className="w-4 h-4" /> },
    { name: "Explore", icon: <Globe className="w-4 h-4" /> },
    { name: "Packages", icon: <MapPin className="w-4 h-4" /> },
    { name: "Contact", icon: <Phone className="w-4 h-4" /> },
  ];

  if (!mounted) {
    return null; // Prevents rendering before hydration
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
  <Link
    href={user?.role === "admin" ? "/admin" : "/"}
    className="flex items-center space-x-2"
  >
    <Globe className="h-8 w-8 text-blue-600" />
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
      TravelEase
    </span>
  </Link>
</div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={`/${item.name.toLowerCase()}`}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Search Bar */}
            {/* <div className="relative text-gray-600">
              <input
                type="text"
                placeholder="Search destinations..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-800" />
            </div> */}

            {/* Login/Profile Button */}
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 bg-blue-600 text-white px-1 py-1 rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <Image
                  src={"/avatar.jpeg"}  // Fallback to default image if no avatar URL is available
                  alt="Avatar"
                  width={32}  // Fixed width for consistency
                  height={32} // Fixed height for consistency
                  className="rounded-full"
                  loading="lazy"
                />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={`/${item.name.toLowerCase()}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Mobile Search */}
              {/* <div className="relative px-3 py-2">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-6 top-4.5 h-5 w-5 text-gray-400" />
              </div> */}

              {/* Mobile Login/Profile Button */}
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <Link
                    href="/profile"
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Image
                      src={"/avatar.jpeg"}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                      loading="lazy"
                    />
                    <span>{user?.name}</span>
                  </Link>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <Link
                    href="/auth/login"
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
