import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
    const payload = { id: user._id };
    const options = { expiresIn: '9h' };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
  };