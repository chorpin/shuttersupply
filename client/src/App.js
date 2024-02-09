import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import GetCompanyInfo from './components/GetCompanyInfo';
import Login from './components/Login'
import Sidebar from './components/SideBar';
import NavBar from './components/NavBar';
import Card from './components/Card';
import CallbackHandler from './components/CallbackHandler';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './actions/authActions';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { handleLogin } from './services/loginService';
function App() {
  
  const {isAuthenticated,jwtToken} =useSelector((state)=>{
    console.log('state:',state)
    return state.auth
  })
  const dispatch =useDispatch()

  useEffect(()=>{
    if(jwtToken){
      dispatch(login())
    }
  },[jwtToken,dispatch])

  return (
    
    <div className="App">
      <div className='content'>
        <NavBar/>
        <div className='card-lists'>
        <Routes>
          <Route exact path="/" element={isAuthenticated?(<Card>Create Invoice</Card>) : 
          (<Card onClick={handleLogin} cardType='logIn'>Auto Log In</Card>)
          }/>
          <Route path="/callbackfront" element={<CallbackHandler/>}/>
        </Routes>
        </div>
       
        
      </div>
      
    </div>
  );
}

export default App;
