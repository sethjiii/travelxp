// pages/api/users.js
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const { name, email, password } = req.body;

      const newUser = new User({
        name,
        email,
        password,
      });

      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
