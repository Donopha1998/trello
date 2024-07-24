import mongoose from 'mongoose';

const connectDB = async (mongoURI) => {
  if (!mongoURI) {
    throw new Error('MongoDB URI is not provided');
  }
  
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
