// models/Subscription.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ['Basic', 'Pro'],
      required: true,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        'active',
        'trialing',
        'past_due',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'unpaid',
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
