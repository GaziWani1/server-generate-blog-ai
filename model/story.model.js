import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  { timestamps: true }
);

// Add full-text index for search
storySchema.index({ title: 'text', story: 'text', description: 'text' });

export default models.Story || model('Story', storySchema);
