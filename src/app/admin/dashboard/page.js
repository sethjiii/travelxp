"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  Upload,
  PackageOpen,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Hotel,
  IndianRupee,
} from "lucide-react";
import Image from "next/image";

const AdminTravelPackage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    places: "",
    cityId: [],
    currency: "USD",
    duration: "",
    itinerary: [
      {
        day: 1,
        title: "",
        description: "",
        stay: "",
        activities: [
          {
            name: "",
            time: "",
            additionalDetails: "",
          },
        ],
      },
    ],
    highlights: [""],
    inclusions: [""],
    exclusions: [""],
    availability: {
      startDate: "",
      endDate: "",
    },
    images: [],
  });


  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/destinations'); // Adjust path based on your setup
        const data = await res.json();
        console.log(data.destinations)
        setCityList(data.destinations); // assuming response is { cities: [...] }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  // Handle itinerary day changes
  const handleDayChange = (dayIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

  // Handle activity changes within a day
  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, actIdx) =>
                actIdx === activityIndex
                  ? { ...activity, [field]: value }
                  : activity
              ),
            }
          : day
      ),
    }));
  };

  // Add new day to itinerary
  const addDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: "",
          description: "",
          stay: "",
          activities: [
            {
              name: "",
              time: "",
              additionalDetails: "",
            },
          ],
        },
      ],
    }));
  };

  // Add activity to a specific day
  const addActivity = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: [
                ...day.activities,
                {
                  name: "",
                  time: "",
                  additionalDetails: "",
                },
              ],
            }
          : day
      ),
    }));
  };

  // Remove activity from a specific day
  const removeActivity = (dayIndex, activityIndex) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: day.activities.filter(
                (_, actIdx) => actIdx !== activityIndex
              ),
            }
          : day
      ),
    }));
  };

  // Remove day from itinerary
  const removeDay = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, idx) => idx !== dayIndex)
        .map((day, idx) => ({ ...day, day: idx + 1 })),
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...base64Images],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      console.log("token");
      const response = await fetch("/api/admin/addpackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Prefix the token with 'Bearer '
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add travel package");
      }

      setSuccess("Travel package added successfully!");
      // Reset form...
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: PackageOpen },
    { id: "details", label: "Package Details", icon: Clock },
    { id: "media", label: "Media", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Travel Package Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage travel packages for your customers
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                {/* Basic Info Fields */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  <input
                    placeholder="Package Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />

                  <input
                    placeholder="Places ( enter places sperated by -  only )"
                    value={formData.places}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        places: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
<div className="mb-4">
  <label className="block font-medium mb-1 text-sm text-gray-700">Select Cities:</label>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
    {cityList.map((city) => (
      <label
        key={city._id}
        className={`flex items-center gap-1 px-2 py-1 border rounded-md text-sm cursor-pointer transition ${
          formData.cityId.includes(city._id)
            ? 'bg-blue-100 border-blue-500 text-blue-800 font-medium'
            : 'hover:bg-gray-100'
        }`}
      >
        <input
          type="checkbox"
          value={city._id}
          checked={formData.cityId.includes(city._id)}
          onChange={() => {
            const selected = formData.cityId.includes(city._id);
            setFormData((prev) => ({
              ...prev,
              cityId: selected
                ? prev.cityId.filter((id) => id !== city._id)
                : [...prev.cityId, city._id],
            }));
          }}
          className="accent-blue-500 h-4 w-4"
        />
        <span>{city.city}</span>
      </label>
    ))}
  </div>
</div>





                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="INR">INR</option>
                    </select>

                    <input
                      placeholder="Duration (e.g., 7 days, 6 nights)"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Itinerary Section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Itinerary</h2>
                    <button
                      type="button"
                      onClick={addDay}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Day
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.itinerary.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Day {day.day}</h3>
                          <button
                            type="button"
                            onClick={() => removeDay(dayIndex)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            placeholder="Day Title"
                            value={day.title}
                            onChange={(e) =>
                              handleDayChange(dayIndex, "title", e.target.value)
                            }
                            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                          />
                          <div className="relative">
                            <Hotel className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              placeholder="Stay (Hotel/Resort)"
                              value={day.stay}
                              onChange={(e) =>
                                handleDayChange(
                                  dayIndex,
                                  "stay",
                                  e.target.value
                                )
                              }
                              className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>

                        <textarea
                          placeholder="Day Description"
                          value={day.description}
                          onChange={(e) =>
                            handleDayChange(
                              dayIndex,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Activities</h4>
                            <button
                              type="button"
                              onClick={() => addActivity(dayIndex)}
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Activity
                            </button>
                          </div>

                          {day.activities.map((activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="grid grid-cols-2 gap-4 border-l-2 border-blue-500 pl-4"
                            >
                              <div className="space-y-2">
                                <input
                                  placeholder="Activity Name"
                                  value={activity.name}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      dayIndex,
                                      activityIndex,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  required
                                />
                                <input
                                  placeholder="Time (e.g., 09:00 AM)"
                                  value={activity.time}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      dayIndex,
                                      activityIndex,
                                      "time",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                              <div className="flex gap-2">
                                <textarea
                                  placeholder="Additional Details"
                                  value={activity.additionalDetails}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      dayIndex,
                                      activityIndex,
                                      "additionalDetails",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeActivity(dayIndex, activityIndex)
                                  }
                                  className="p-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-6">
                {["highlights", "inclusions", "exclusions"].map((field) => (
                  <div key={field} className="bg-white rounded-lg p-6 border">
                    <h2 className="text-xl font-semibold capitalize mb-2">
                      {field}
                    </h2>
                    <p className="text-gray-500 mb-4">
                      Add or remove {field} items
                    </p>

                    <div className="space-y-4">
                      {formData[field].map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            placeholder={`Add ${field} item`}
                            value={item}
                            onChange={(e) =>
                              handleArrayChange(field, index, e.target.value)
                            }
                            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem(field, index)}
                            className="p-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem(field)}
                        className="w-full px-4 py-2 border-2 border-dashed rounded-md text-gray-500 hover:text-blue-500 hover:border-blue-500 flex items-center justify-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add {field.slice(0, -1)}</span>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="bg-white rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-2">Availability</h2>
                  <p className="text-gray-500 mb-4">
                    Set the date range for this package
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.availability.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              startDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.availability.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              endDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="bg-white rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-2">Package Images</h2>
                <p className="text-gray-500 mb-4">
                  Upload images for the travel package
                </p>

                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        fill
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">
                      Upload Images
                    </span>
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-500 p-4 rounded-md">
                {success}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    activeTab === "basic"
                      ? "basic"
                      : activeTab === "details"
                      ? "basic"
                      : "details"
                  )
                }
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Previous
              </button>

              {activeTab === "media" ? (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? "Publishing..." : "Publish Package"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === "basic" ? "details" : "media")
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTravelPackage;
