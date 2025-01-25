"use client";
import React from "react";
import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600">Admin Dashboard</h1>
      <p className="text-center font-sans text-lg text-gray-600 mt-4">
        Welcome to the admin dashboard! You can manage packages and bookings from here.
      </p>

      <div className="mt-10 space-y-6 space-x-10 text-center">
        <Link href="/admin/dashboard/">
          <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
            Add Package
          </button>
        </Link>


        <Link href="/admin/bookings">
          <button className="bg-yellow-600 text-white py-2 px-6 rounded-md hover:bg-yellow-700">
            View All Bookings
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
