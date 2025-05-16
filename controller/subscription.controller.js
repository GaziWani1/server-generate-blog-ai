// import stripe
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config/env.js';
import subscriptiondetailsModel from '../model/subscriptiondetails.model.js';
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

    const subscription = new subscriptiondetailsModel({
      userId: req.user._id,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error Subscription:', error.message);
    return res.status(500).json({ error: 'Subscription Failed' });
  }
};
