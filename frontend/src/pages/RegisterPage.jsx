import React from 'react';
import Register from '../components/Auth/Register/Register';

const RegisterPage = () => {
  return (
    <div  style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:"2rem"}}>
      <h3 style={{fontSize:"24px",color:"#1677ff"}}>SignUp</h3>
      <Register />
    </div>
  );
};

export default RegisterPage;
