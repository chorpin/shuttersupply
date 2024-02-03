// src/store/index.js

import { legacy_createStore as createStore } from 'redux';
import rootReducer from '../reducers';

const store = createStore(rootReducer);

export default store;

/**
 * 
 * 
 * src/
|-- actions/
|   |-- authActions.js
|-- reducers/
|   |-- authReducer.js
|   |-- index.js  // 组合所有的 reducers
|-- store/
|   |-- index.js  // 创建和配置 store
|-- components/
|   |-- AutoLogin.js
|-- App.js
|-- index.js
 */