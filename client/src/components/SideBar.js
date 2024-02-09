// 在 Sidebar.js 文件中
import React, { useState } from 'react';
import './SideBar.css'; // 引入CSS样式
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <ul className="sidebar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {/* 添加更多链接根据需要 */}
      </ul>
    </div>
  );
};

export default Sidebar;
