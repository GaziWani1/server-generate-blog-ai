import jwt from 'jsonwebtoken';
import userModel from '../model/user.model.js';

export const signIn = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    throw new Error('Credientails Required');
  }
  try {
    req.token = token;
    const user = await jwt.decode(token);

    const userExist = await userModel.findOne({
      googleId: user.sub,
    });

    if (userExist) {
      return res.status(200).json({
        user: userExist,
        token,
        message: 'User Loged In successfully',
      });
    }
    const newUser = new userModel({
      name: user.name,
      googleId: user.sub,
      email: user.email,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ user: newUser, token, message: 'User Signed In successfully' });
  } catch (error) {
    next(error);
  }
};
