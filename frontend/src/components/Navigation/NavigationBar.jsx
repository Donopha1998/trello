import React from 'react';
import { Layout, Button } from 'antd';
import viteLogo from '/vite.svg';
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavigationBar.css';

const { Header } = Layout;

const NavigationBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Header className="header">
      <div className="logo">
        <img src={viteLogo} alt="logo" className="logo-image" />
      </div>
      {isAuthenticated ? (
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      ) : (
        <div className="auth-buttons">
          <Link to="/login">
            <Button type="primary" icon={<LoginOutlined />} className="auth-button">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button type="primary" icon={<UserAddOutlined />} className="auth-button">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </Header>
  );
};

export default NavigationBar;
