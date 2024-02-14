import React, { useState, useEffect } from 'react';
import './ItemForm.css'; // 确保导入了CSS样式文件

const ItemForm = ({onClose}) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // 获取当前日期，格式为YYYY-MM-DD
    setDate(today);
  }, []);

  return (
    <div className="form-container">
      <div className="form-header">
        <span>Create Item</span>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <form className="item-form">
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div className="input-group">
          <label htmlFor="sku">SKU:</label>
          <input type="text" id="sku" name="sku" />
        </div>
        <div className="input-group">
          <label htmlFor="qty">Qty:</label>
          <input type="number" id="qty" name="qty" />
        </div>
        <div className="input-group">
          <label htmlFor="date">Date:</label>
          <span type="date" id="date" name="date"> {date}</span>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
