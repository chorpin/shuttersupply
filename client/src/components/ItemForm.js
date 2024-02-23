import React, { useState, useEffect } from 'react';
import './ItemForm.css'; // 确保导入了CSS样式文件

const ItemForm = ({onClose, onSubmit}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // 获取当前日期，格式为YYYY-MM-DD
    setDate(today);
  }, []);

  const handleSubmit = (e)=>{
    e.preventDefault()
    onSubmit({name, sku, qty, date})
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <span>Create Item</span>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={name}
            onChange={e=>setName(e.target.value)}
            />
        </div>
        <div className="input-group">
          <label htmlFor="sku">SKU:</label>
          <input 
            type="text" 
            id="sku" 
            name="sku" 
            value={sku}
            onChange={e=>setSku(e.target.value)}/>
        </div>
        <div className="input-group">
          <label htmlFor="qty">Qty:</label>
          <input 
            type="number" 
            id="qty" 
            name="qty" 
            value={qty}
            onChange={e=>setQty(e.target.value)}
            />
        </div>
        <div className="input-group">
          <label htmlFor="date">Date:</label>
          <span type="date" id="date" name="date"> {date}</span>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default ItemForm;
