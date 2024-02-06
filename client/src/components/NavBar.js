// 在 NavBar.js 文件中
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // 引入CSS样式

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img src={require('../assets/images/logo.jpg').default} alt="Logo" className="logo" />
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">About</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
