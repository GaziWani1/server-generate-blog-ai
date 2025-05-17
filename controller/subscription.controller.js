// import stripe
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config/env.js';
import subscriptiondetailsModel from '../model/subscriptiondetails.model.js';
import subscriptionModel from '../model/subscription.model.js';
import userModel from '../model/user.model.js';
const stripe = new Stripe(STRIPE_SECRET_KEY);

// Get subscription details
export const getSubscriptionDetails = async (req, res) => {
  try {
    const data = await subscriptiondetailsModel.find().sort({ name: 1 });
    res.status(200).json({
      message: 'Subscription details',
      data,
    });
  } catch (error) {}
};

// subscription controller
export const subscription = async (req, res) => {
  try {
    const { priceId } = req.body;
    console.log(priceId);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url:
        'http://localhost:5173/dashboard/user/billing?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourdomain.com/cancel',
    });

    const subscriptionData = await subscriptiondetailsModel.findOne({
      id: priceId,
    });

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(currentPeriodStart);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    // Handle edge case: Feb 31 → Mar 3 etc.
    // So normalize to the same day or last day of next month
    if (currentPeriodStart.getDate() !== currentPeriodEnd.getDate()) {
      currentPeriodEnd.setDate(0); // set to last day of previous month
    }

    const subscription = new subscriptionModel({
      user: req.user._id,
      stripeSubscriptionId: session.id,
      stripePriceId: priceId,
      plan: subscriptionData?.name || 'Default Plan',
      currentPeriodStart,
      currentPeriodEnd,
      status: 'active',
    });

    const user = await userModel.findById(req.user._id);

    if (subscriptionData.name === 'Pro' && session.id) {
      user.credits += 180;
      user.subscription = subscriptionData._id;
    } else if (subscriptionData.name === 'Basic' && session.id) {
      user.credits += 69;
      user.subscription = subscriptionData._id;
    }

    await user.save();

    await subscription.save();

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error Subscription:', error.message);
    return res.status(500).json({ error: 'Subscription Failed' });
  }
};

export const getCurrentSubscriptions = async (req, res) => {
  try {
    const data = await subscriptionModel.find({ user: req.user._id });
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error Subscription:', error.message);
    return res.status(500).json({ error: 'Subscription Failed' });
  }
};
