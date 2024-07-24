import { sendErrorResponse } from '../helpers/errorResponse.js';
import User from '../models/userModel.js';
import { generateToken } from '../utils/utils.js';


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;


  if (!name?.firstName || !name?.lastName || !email || !password) {
    return sendErrorResponse(res, 400, 'All fields are required: first name, last name, email, and password.');
  }

  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendErrorResponse(res, 400, 'User already exists');
    }


    const user = new User({ name: { firstName: name.firstName, lastName: name.lastName }, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {

    sendErrorResponse(res, 500, 'Internal server error');
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return sendErrorResponse(res, 400, 'Invalid credentials');
    }

    const token = generateToken(user)
    res.json({ token });

  } catch (error) {
    sendErrorResponse(res, 500, 'Internal server error');
  }
};


