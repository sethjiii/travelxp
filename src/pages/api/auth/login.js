import dbConnect from '../dbConnect';            // Adjust path if needed
import User from '../../../models/user';         // Your Mongoose User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user)
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET is not defined in environment variables!');
      return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' });
    }

    const tokenPayload = { userId: user._id, role: user.role };
    const tokenExpiry = user.role === 'admin' ? '6h' : '8h';

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: tokenExpiry });

    // Set cookie with token
    const tokenExpiryInSeconds = tokenExpiry === '6h' ? 6 * 60 * 60 : 8 * 60 * 60;
    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokenExpiryInSeconds,
        path: '/',
      })
    );

    // Return user data except password
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.profilePicture,
        token,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('❌ Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
