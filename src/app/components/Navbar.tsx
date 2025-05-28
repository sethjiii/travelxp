"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Globe, Menu, X, User, Phone, LogOut, Settings, Heart, Copy, SearchCheck, Search } from "lucide-react";
import { useAuth } from "../../Auth/AuthProvider";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const menuItems = [
    { name: "Destinations", icon: <MapPin className="w-4 h-4" /> },
    { name: "Packages", icon: <MapPin className="w-4 h-4" /> },
    { name: "Contact us", icon: <Phone className="w-4 h-4" /> },
    { name: "About us", icon: <Search className="w-4 h-4" /> },
  ];

  const renderProfileMenu = () => (
    <div
      className={`absolute z-50 top-16 divide-y ml-1 divide-gray-500 right-5 w-48 bg-white shadow-2xl rounded-xl mt-2 overflow-hidden transition-all duration-300 ${
        isProfileMenuOpen ? "block" : "hidden"
      }`}
    >
      {/* Profile Header */}
      <div className="flex items-center gap-2 ml-2 p-1 divide-gray-200   text-gray-700">
        <Image
          src="/avatar.jpeg"
          alt="Profile"
          width={30}
          height={30}
          className="rounded-full border-2 border-gray-400"
        />
        <div>
          <p className="font-semibold font-sans">{user?.name || "Guest"}</p>
          {/* <p className="text-sm opacity-90">View Profile</p> */}
        </div>
      </div>
  
      {/* Menu Options */}
      <div className="flex flex-col divide-y ml-1 divide-gray-200 text-gray-800 text-sm bg-white">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition"
          onClick={() => setIsProfileMenuOpen(false)}
        >
          <Settings className="h-4 w-4 text-blue-600" />
          Dashboard
        </Link>
  
        <Link
          href="/trips"
          className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition"
          onClick={() => setIsProfileMenuOpen(false)}
        >
          <MapPin className="h-4 w-4 text-green-600" />
          My Trips
        </Link>
  
        <Link
          href="/wishlist"
          className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition"
          onClick={() => setIsProfileMenuOpen(false)}
        >
          <Heart className="h-4 w-4 text-pink-500" />
          Wishlist
        </Link>
  
        <Link
          href="/settings"
          className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition"
          onClick={() => setIsProfileMenuOpen(false)}
        >
          <Settings className="h-4 w-4 text-gray-600" />
          Settings
        </Link>
  
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-2 text-red-600 hover:bg-gray-50 transition w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
  

  if (!mounted) return null;

  return (
    <nav className="bg-white shadow-lg  relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href={user?.role === "admin" ? "/admin" : "/"}>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Globe className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                TravelEase
              </span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex  items-center space-x-8">
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

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-1 py-1 rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  <Image
                    src="/avatar.jpeg"
                    alt="Avatar"
                    width={28}
                    height={28}
                    className="rounded-full"
                    loading="lazy"
                  />
                </button>
                {renderProfileMenu()}
              </div>
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
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

            {isAuthenticated ? (
              <div className="px-3 py-2">
                <Link
                  href="/profile"
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  <Image
                    src="/avatar.jpeg"
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;
