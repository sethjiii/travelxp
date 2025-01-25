"use client"
import React from 'react';
import { 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Plane,
  Heart,
  MessageCircle,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const destinations = [
    'Europe Tours',
    'Asian Adventures',
    'African Safaris',
    'American Travels',
    'Oceania Expeditions'
  ];

  const quickLinks = [
    'Latest Deals',
    'Travel Insurance',
    'How It Works',
    'Travel Blog',
    'Gift Cards'
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-blue-950 text-white mt-8">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Plane className="h-6 w-6 text-blue-400" />
              <span className="text-2xl font-bold">TravelEase</span>
            </div>
            <p className="text-blue-200 mb-6">
              Discover the world with us. We create unforgettable travel experiences 
              and help you explore the most beautiful destinations around the globe.
            </p>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-blue-800 hover:bg-blue-700 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="p-2 bg-blue-800 hover:bg-blue-700 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="p-2 bg-blue-800 hover:bg-blue-700 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="p-2 bg-blue-800 hover:bg-blue-700 rounded-full transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-lg font-bold mb-6">Popular Destinations</h3>
            <ul className="space-y-3">
              {destinations.map((destination) => (
                <li key={destination}>
                  <a 
                    href="#" 
                    className="text-blue-200 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    {destination}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-blue-200 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <p className="flex items-start gap-3 text-blue-200">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>123 Adventure Street, Wanderlust City, Travel Land 12345</span>
              </p>
              <p className="flex items-center gap-3 text-blue-200">
                <Phone className="h-5 w-5" />
                <span>+1 (234) 567-8900</span>
              </p>
              <p className="flex items-center gap-3 text-blue-200">
                <Mail className="h-5 w-5" />
                <span>contact@travelease.com</span>
              </p>
              <p className="flex items-center gap-3 text-blue-200">
                <Clock className="h-5 w-5" />
                <span>24/7 Customer Support</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-blue-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-blue-200 text-sm">
              © {currentYear} TravelEase. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;