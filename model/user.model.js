import mongoose, { model } from 'mongoose';

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: true,
    },
    subscription: {},
    credits: {
      type: Number,
      default: 12,
    },
  },
  { timestamps: true }
);

user.index({ title: 1, createdBy: 1 });

export default model('User', user);
