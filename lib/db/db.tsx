import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

export default connectDB;