import mongoose, { model } from 'mongoose';

const story = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },
    duration: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timeUnit: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true, // also indexed for faster lookups by creator
    },
  },
  { timestamps: true }
);

story.index({ title: 1, createdBy: 1 });

export default model('Story', story);
