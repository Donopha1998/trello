import { body, validationResult } from 'express-validator';
import { sendErrorResponse } from '../helpers/errorResponse.js';

// Validation rules for creating a task
const validateCreateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, errors.array().map(err => err.msg).join(', '));
    }
    next();
  }
];

// Validation rules for updating a task
const validateUpdateTask = [
  body('title').optional().notEmpty().withMessage('Title must not be empty if provided'),
  body('description').optional().isString().withMessage('Description must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, errors.array().map(err => err.msg).join(', '));
    }
    next();
  }
];

export { validateCreateTask, validateUpdateTask };
