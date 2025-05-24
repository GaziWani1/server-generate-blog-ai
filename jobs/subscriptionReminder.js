import userModel from '../model/user.model.js';

export const $ = async (req, res) => {
  try {
    const users = await userModel
      .find({ subscription: { $exists: true } })
      .populate('subscription');

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users with subscriptions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
