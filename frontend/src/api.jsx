import axios from 'axios';
import Cookies from 'js-cookie';
import config from './Utils/config';
const API_URL = `${config.apiUrl}/api`; 


const getAuthToken = () => {
  return Cookies.get('authToken'); 
};


const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data.token;
};

export const googleLoginUser = async (credential) => {
  const response = await axios.post('/api/auth/google-login', { credential });
  return response.data.token;
};

export const registerUser = async (userData) => {
  await axiosInstance.post('/auth/register', userData);
};

export const createTask = async (taskData) => {
  const response =  await axiosInstance.post('/tasks', taskData);
  return response.data
};

export const getTasks = async ({ searchTerm = '', sortBy = '' } = {}) => {
  const response = await axiosInstance.get('/tasks',{
    params: {
      search: searchTerm,
      sortOrder: sortBy
    }
  });
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {

  await axiosInstance.patch(`/tasks/${taskId}?status=${status}`,);
};

export const updateTask = async (taskId,data) => {
console.log('entered')
  await axiosInstance.patch(`/tasks/${taskId}`,data);
};
export const deleteTask = async (taskId) => {
  await axiosInstance.delete(`/tasks/${taskId}`);
};
