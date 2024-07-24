import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 

  useEffect(() => {
    const token = Cookies.get('authToken');
    setIsAuthenticated(!!token);
  }, []); 

  const login = (token) => {
    Cookies.set('authToken', token, { expires: 7, path: '/', secure: true, sameSite: 'Strict' });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('authToken');
    setIsAuthenticated(false);
  };

 
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
