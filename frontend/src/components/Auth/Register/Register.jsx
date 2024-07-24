import React from 'react';
import RegisterForm from './RegisterForm';
import './Register.css'; 
import GoogleLoginButton from '../../Google/GoogleButton';
import { Divider } from 'antd';
import { Link } from 'react-router-dom';
import config from '../../../Utils/config';

const Register = () => {
  const handleGoogleSuccess = (response) => {
    window.location.href = `${config.apiUrl}/api/auth/google`;
  };

  const handleGoogleFailure = (error) => {
    notification.error({
      message: 'Registration Failed',
      description: 'Google login failed. Please try again.',
    });
  };

  return (
    <div className="register-container">
      <RegisterForm />
      <Divider>Or</Divider>
      <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
      <div className="register-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;
