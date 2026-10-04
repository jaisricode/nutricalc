import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables.');
    console.warn('ℹ️  Please set MONGODB_URI in your .env file to connect to MongoDB Atlas.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.warn('ℹ️  Ensure your IP address is whitelisted in MongoDB Atlas Network Access and credentials are valid.');
    return false;
  }
};
