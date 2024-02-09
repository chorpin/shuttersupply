// 在 src/components/Card.js 中

import React from 'react';
import './Card.css'; // 引入专门为Card组件创建的CSS文件

const Card = ({ children,onClick,cardType}) => {
    const cardClass =`card ${cardType}`
    return <div className={cardClass} onClick={onClick}>{children}</div>;
};

export default Card;
