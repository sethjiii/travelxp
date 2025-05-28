import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import TravelPackage from '../../../models/TravelPackages';
import DestinationModel from '../../../models/Destination';
import dbConnect from '../dbConnect';
import mongoose from 'mongoose';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const {
      name,
      description,
      itinerary,
      price,
      currency,
      duration,
      highlights,
      inclusions,
      exclusions,
      availability,
      images,
      places,
      cityId, // city IDs from formData
    } = req.body;

    console.log(req.body.cityId)
    if (
      !name || !description || !price || !duration || !currency ||
      !Array.isArray(cityId) || cityId.length === 0
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images || []) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'travel-packages',
        });
        uploadedImages.push(result.secure_url);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    // Create and save the new package
    const newPackage = new TravelPackage({
      name,
      description,
      itinerary,
      price,
      currency,
      duration,
      highlights,
      inclusions,
      exclusions,
      availability,
      places,
      images: uploadedImages,
    });

    const savedPackage = await newPackage.save();

    // Validate and update destination cities
    await Promise.all(
      cityId.map(async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          console.warn(`Invalid ObjectId: ${id}`);
          return null;
        }
    
        const updated = await DestinationModel.findByIdAndUpdate(
          id,
          { $addToSet: { packages: savedPackage._id } },
          { new: true } // optional: return the updated document
        );
        // 6836903b1fd0770ae97a7731
        if (!updated) {
          console.warn(`Destination not found for ID: ${id}`);
        }
    
        return updated;
      })
    );

    return res.status(201).json({
      message: 'Travel package added and linked to cities successfully',
      package: savedPackage,
    });
  } catch (error) {
    console.error('Error adding package:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
