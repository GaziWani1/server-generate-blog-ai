import jwt from 'jsonwebtoken';
import userModel from '../model/user.model.js';
export const authorization = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'unathorized' });
    }
    const isUser = await jwt.decode(token);

    if (!isUser) {
      throw new Error('invalid access token');
    }

    const user = await userModel.findOne({ googleId: isUser.sub });

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    throw new Error('Internal Server Error');
  }
};
