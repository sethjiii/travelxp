import Image from 'next/image';
import React from 'react';

const ContactUsPage: React.FC = () => {
  // Define the interfaces directly within the component file
  interface ContactInfo {
    title: string;
    details: string[];
  }

  interface SocialMedia {
    platform: string;
    url: string;
    iconClass: string; // For FontAwesome or other icons
  }

  interface ContactPageData {
    phoneNumbers: ContactInfo;
    emailAddresses: ContactInfo;
    socialMedia: SocialMedia[];
    address: string;
  }

  const contactData: ContactPageData = {
    phoneNumbers: {
      title: 'Phone Numbers',
      details: [
        'General Inquiries: +1 (123) 456-7890',
        'Support: +1 (123) 555-0199',
        'Sales: +1 (123) 987-6543',
      ],
    },
    emailAddresses: {
      title: 'Email Addresses',
      details: [
        'Support: support@example.com',
        'Sales: sales@example.com',
        'General Inquiries: info@example.com',
      ],
    },
    socialMedia: [
      {
        platform: 'Facebook',
        url: 'https://facebook.com',
        iconClass: 'fab fa-facebook fa-2x',
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com',
        iconClass: 'fab fa-twitter fa-2x',
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com',
        iconClass: 'fab fa-linkedin fa-2x',
      },
    ],
    address: '1234 Some Street, City, Country, ZIP',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden shadow-xl">
          
        <Image
  src="/cu.jpg"
  alt="Contact Us"
  width={1000}
  height={1000}
  className="w-full h-72 sm:h-96 object-cover"
/>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <h1 className="absolute bottom-8 left-8 text-3xl sm:text-4xl font-bold text-white leading-tight">
            Contact Us
          </h1>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-700 mb-4">
            We&apos;re here to help! Please feel free to reach out with any inquiries or feedback you may have.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone Numbers */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{contactData.phoneNumbers.title}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {contactData.phoneNumbers.details.map((number, index) => (
                  <li key={index}>{number}</li>
                ))}
              </ul>
            </div>

            {/* Email Addresses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{contactData.emailAddresses.title}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {contactData.emailAddresses.details.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Follow Us</h2>
          <p className="text-lg text-gray-700 mb-4">
            Stay connected with us through our social media channels for updates and news!
          </p>
          <div className="flex space-x-6">
            {contactData.socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <i className={social.iconClass}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Our Address</h2>
          <p className="text-lg text-gray-700">{contactData.address}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
