import jwt from 'jsonwebtoken';
export const authorization = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'unathorized' });
    }
    const user = await jwt.decode(token);

    if (!user) {
      throw new Error('invalid access token');
    }

    req.user = user;

    next();
  } catch (error) {
    throw new Error('Internal Server Error');
  }
};
