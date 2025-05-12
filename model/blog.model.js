import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    readingTime: {
      type: String,
      required: true,
    },
    blog: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Add full-text index for search
blogSchema.index({ title: 'text', blog: 'text' });

export default model('blog', blogSchema);
