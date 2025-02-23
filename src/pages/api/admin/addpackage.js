import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import TravelPackage from '../../../models/TravelPackages';
import dbConnect from '../dbConnect';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { db } = await dbConnect();

  try {
    // Extract, trim, and log token
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("Extracted and trimmed token:", token);


    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         console.log("Decoded token (immediate verification):", decoded);
       

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    // Rest of the logic remains unchanged
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
    } = req.body;

    if (!name || !description || !price || !duration || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const uploadedImages = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'travel-packages',
      });
      console.log(result.secure_url)
      uploadedImages.push(result.secure_url);
    }

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
      images: uploadedImages,
    });

    // await newPackage.save();
    const result = await db.collection('TravelPackage').insertOne(newPackage);
    console.log(result)
    res.status(201).json({ message: 'Travel package added successfully', package: newPackage });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.error("JWT verification error:", error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error('Error adding package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
