import mongoose from 'mongoose';
import { DB_URI } from '../config/env.js';

if (!DB_URI) throw new Error('Please define DB_URI');

export const connectDb = async () => {
  try {
    return await mongoose.connect(DB_URI);
  } catch (error) {
    console.log('Error connecting to database:', error);
    process.exit(1);
  }
};
