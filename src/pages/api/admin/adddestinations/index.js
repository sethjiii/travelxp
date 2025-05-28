import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '../../dbConnect';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Destructure db from your dbConnect function
    const { db } = await dbConnect();

    // JWT validation
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization header' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    // Extract and validate fields
    const { city, description = '', packages = [], images = [] } = req.body;

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return res.status(400).json({ error: 'City is required and must be a string' });
    }

    if (!Array.isArray(packages)) {
      return res.status(400).json({ error: 'Packages must be an array' });
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Images must be an array' });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const base64Image of images) {
      try {
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'destinations',
        });
        uploadedImages.push(result.secure_url);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    // Prepare destination document
    const newDestination = {
      city: city.trim(),
      description: description.trim(),
      packages,
      images: uploadedImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into DB
    const result = await db.collection('destinations').insertOne(newDestination);

    return res.status(201).json({
      message: 'Destination added successfully',
      destinationId: result.insertedId,
    });
  } catch (error) {
    console.error('Error adding destination:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
