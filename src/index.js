import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import storage from './utils/storage';
import memory from './utils/memory';

//刷新页面时：读取local中保存user，保存到内存中
const user = storage.getUser()
memory.user = user

ReactDOM.render(
  // <React.StrictMode></React.StrictMode> 取消了本标签包裹的<App />，取消了react中的严格模式(存在时，使用antd会报错)
    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
