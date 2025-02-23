"use client";
import React from "react";
import { useAuth } from "../../Auth/AuthProvider";
import { Mail, Phone, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  email: string;
  name: string;
  role: string;
  phone?: string; // Optional
  avatarUrl?: string; // Optional
};

const UserProfile = () => {
  const { user, logout } = useAuth() as { user: User | null; logout: () => void };
  const router = useRouter();

  const handleLogout = async () => {
    try {
      logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />

            {/* Profile Avatar */}
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <Image
                  src={user?.avatarUrl || "/api/placeholder/100/100"}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="h-24 w-24 rounded-full ring-4 ring-white object-cover"
                />
                {!user?.avatarUrl && (
                  <div className="absolute inset-0 h-24 w-24 rounded-full ring-4 ring-white bg-blue-700 flex items-center justify-center text-5xl font-semibold">
                    {user?.name?.[0] || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-16 pb-8 px-8">
            <div className="space-y-6">
              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.name || "Travel Enthusiast"}
                </h2>
                <p className="text-gray-500">@{user?.name?.toLowerCase() || "traveler"}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{user?.email || "user@example.com"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{user?.phone ?? "00000"}</span>
                </div>
              </div>

              {/* Travel Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-500">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">48</div>
                  <div className="text-sm text-gray-500">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">156</div>
                  <div className="text-sm text-gray-500">Places</div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
                <p className="text-gray-600">
                  Passionate traveler and photographer. Always seeking new adventures and cultural experiences.
                  Love to share travel tips and connect with fellow explorers around the world.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
