import express from 'express';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './helpers/dbConnect.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const mongoURI = process.env.MONGODB_URI; 

(async () => {
  try {
    await connectDB(mongoURI); 
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
