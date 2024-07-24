import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { notification } from 'antd';
import './GoogleButton.css'

const GoogleLoginButton = ({ onSuccess, onError }) => {
  return (
    <div className='flex-button'>
    <GoogleLogin 
      onSuccess={onSuccess}
      onError={onError}
    />
    </div>
  );
};

export default GoogleLoginButton;
