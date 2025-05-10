import jwt from 'jsonwebtoken';

export const signIn = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    throw new Error('Credientails Required');
  }
  try {
    const user = await jwt.decode(token);
  } catch (error) {
    next(error);
  }
};
