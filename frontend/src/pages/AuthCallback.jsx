import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    console.log('Token from URL:', token);

    if (token) {
      login(token); 
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate, login]);

  return <div>Loading...</div>;
};

export default AuthCallback;
