import { connectToDatabase } from '../dbConnect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
 

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const tokenPayload = { userId: user._id, role: user.role };
    const tokenExpiry = user.role === 'admin' ? '6h' : '8h';
    const token = jwt.sign(tokenPayload, "TRAVELXP", { expiresIn: tokenExpiry });

    // Debugging: Decode the token immediately to verify
    try {
      console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token (immediate verification):", decoded);
    } catch (verifyError) {
      console.error("Error verifying token during debug:", verifyError.message);
      return res.status(500).json({ error: 'Token verification failed during debug.' });
    }

    // Cookie setup
    const tokenExpiryInSeconds = tokenExpiry === '6h' ? 6 * 60 * 60 : 8 * 60 * 60;

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokenExpiryInSeconds,
        path: '/',
      })
    );

    // Success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id:user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.profilePicture,
        token,
        phone:user.phone
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
