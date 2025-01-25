import { connectToDatabase } from '../dbConnect'; // Assuming dbConnect is in utils folder
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fullName, email, phone, password } = req.body;
    console.log(req.body)
    console.log("req.body")

    try {
      // Establish the DB connection
      const { db } = await connectToDatabase();

      // Check if the email already exists in the database
      const existingUser = await db.collection('users').findOne({ email });
    console.log(existingUser)
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      console.log("existingUser")

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user document
      const newUser = {
        name: fullName,
        email,
        phone,
        password: hashedPassword,
        role: 'user', 
        createdAt: new Date(),
      };

      // Insert the new user into the 'users' collection
      const result = await db.collection('users').insertOne(newUser);

      if (result.acknowledged) {
        res.status(201).json({ message: 'User registered successfully' });
      } else {
        res.status(500).json({ error: 'Failed to register user' });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
