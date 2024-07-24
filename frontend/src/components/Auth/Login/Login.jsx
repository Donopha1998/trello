import React from 'react';
import LoginForm from './LoginForm';
import { Divider } from 'antd';
import './LoginPage.css'; 
import GoogleLoginButton from '../../Google/GoogleButton';
import { Link } from 'react-router-dom';
import config from '../../../Utils/config';

const LoginPage = () => {
  const handleGoogleSuccess = (response) => {
    window.location.href = `${config.apiUrl}/api/auth/google`;
  };

  const handleGoogleFailure = (error) => {
    notification.error({
      message: 'Login Failed',
      description: 'Google login failed. Please try again.',
    });
  };

  return (
    <div className="login-container">
      <LoginForm />
      <Divider>Or</Divider>
      <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
      <div className="login-link">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default LoginPage;
