import Task from '../models/taskModel.js';
import { sendErrorResponse } from '../helpers/errorResponse.js';
import { sendSuccessResponse } from '../helpers/successResponse.js';
import mongoose from 'mongoose';

const validateQueryParams = (sortOrder) => {
  const validSortOrders = ['asc', 'desc'];
  return validSortOrders.includes(sortOrder) ? sortOrder : 'desc';
};


// Create Task
export const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return sendErrorResponse(res, 400, 'Title is required');
  }

  try {
    const task = await new Task({
      title,
      description,
      userId: req.user.id 
    }).save();
    sendSuccessResponse(res, 201, task, 'Task created successfully');
  } catch (error) {
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

// Get All Tasks
export const getTasks = async (req, res) => {
  const { search = '', sortOrder } = req.query;

  try {

    const defaultSortOptions = {
      createdAt: -1,
      title: 1      
    };


    const sortOptions = {};
    if (sortOrder === 'recent') {
      sortOptions.createdAt = -1;
    } else if (sortOrder === 'title') {
      sortOptions.title = 1; 
    } else {
     
      Object.assign(sortOptions, defaultSortOptions);
    }

    let tasks = await Task.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId.createFromHexString(req.user.id), 
          title: { $regex: new RegExp(search, 'i') } 
        } 
      },
      { $sort: sortOptions },
      {
        $group: {
          _id: null,
          todo: { $push: { $cond: [{ $eq: ['$status', 'TODO'] }, '$$ROOT', '$$REMOVE'] } },
          in_progress: { $push: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, '$$ROOT', '$$REMOVE'] } },
          done: { $push: { $cond: [{ $eq: ['$status', 'DONE'] }, '$$ROOT', '$$REMOVE'] } },
        }
      },
      { $project: { _id: 0, todo: 1, in_progress: 1, done: 1 } }
    ]);

    sendSuccessResponse(res, 200, tasks, 'Tasks retrieved successfully');
  } catch (error) {
    console.log(error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};


// Get Task Detail
export const getTaskDetail = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId, userId: req.user.id });
    if (!task) return sendErrorResponse(res, 404, 'Task not found');
    sendSuccessResponse(res, 200, task, 'Task details retrieved successfully');
  } catch (error) {
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

// Update Task
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;
  const { status } = req.query;

  const statusObj = {
    todo: "TODO",
    in_progress: "IN_PROGRESS",
    done: "DONE"
  };

  if (updates.status) {
    delete updates.status;
  }
  
  if (status && !statusObj[status]) {
    return sendErrorResponse(res, 400, 'Invalid status');
  }

  try {

    if (status) {
      updates.status = statusObj[status];
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      updates,
      { new: true }
    );
    
    if (!task) return sendErrorResponse(res, 404, 'Task not found or unauthorized');

    sendSuccessResponse(res, 200, task, 'Task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });
    if (!task) return sendErrorResponse(res, 404, 'Task not found or unauthorized');
    sendSuccessResponse(res, 200, null, 'Task deleted successfully');
  } catch (error) {
    sendErrorResponse(res, 500, 'Internal server error');
  }
};
