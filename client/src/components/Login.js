import React from 'react';
//import { useDispatch } from 'react-redux';
//import { setJwtToken,login } from '../actions/authActions';
//import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../services/loginService';
const AutoLogin = () => {
  

  return (
    <button onClick={handleLogin}>Auto Login</button>
  );
};

export default AutoLogin;
