import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, getTaskDetail } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCreateTask, validateUpdateTask } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateCreateTask, createTask);
router.get('/', getTasks);
router.get('/:taskId',getTaskDetail);

router.patch('/:taskId', validateUpdateTask, updateTask);

router.delete('/:taskId', deleteTask);

export default router;
