import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import 'antd/dist/reset.css';
import NavigationBar from './components/Navigation/NavigationBar';
import ProtectedRoute from './Utils/ProtectedRoute';
import PublicRoute from './Utils/PublicRoute';
import { Navigate } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <NavigationBar />
          <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
            
            <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
 <Route
            path="*"
            element={<Navigate to="/login" />}
          />
      
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
