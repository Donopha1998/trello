import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dotenv from 'dotenv';
import passport from './helpers/passport.js';
dotenv.config();

const app = express();


app.use(express.json());  
app.use(cors());          
app.use(helmet());       


app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes); 


app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
