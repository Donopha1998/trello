import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO' 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
