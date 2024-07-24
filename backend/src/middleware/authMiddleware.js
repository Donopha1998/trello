import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../helpers/errorResponse.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return sendErrorResponse(res, 401, 'No token provided');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendErrorResponse(res, 401, 'Invalid token');
  }
};

export default authMiddleware;
