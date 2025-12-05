import mongoose from 'mongoose';
import { config } from './index';

export const databaseConfig = {
  uri: config.mongoUri,
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

export const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseConfig.uri, databaseConfig.options);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
