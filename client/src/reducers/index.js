// src/reducers/index.js

import { combineReducers } from 'redux';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  // 这里可以添加更多的 reducer 作为应用的一部分
  auth: authReducer
});

export default rootReducer;
