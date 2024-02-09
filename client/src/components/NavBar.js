// 在 NavBar.js 文件中
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // 引入CSS样式

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/Inventory" className="nav-link">Inventory</Link>
        </li>
        <li>
          <Link to="/Merchants" className="nav-link">Merchants</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
