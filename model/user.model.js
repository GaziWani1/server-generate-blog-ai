// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    credits: {
      type: Number,
      default: 12,
      min: 0,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, googleId: 1 });

export default mongoose.model('User', userSchema);
