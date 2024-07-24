import React from 'react';
import Login from '../components/Auth/Login/Login';

const LoginPage = () => {
  return (
    <div  style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:"2rem"}}>
      <h3 style={{fontSize:"24px",color:"#1677ff"}}>Login</h3>
      <Login />
    </div>
  );
};

export default LoginPage;
