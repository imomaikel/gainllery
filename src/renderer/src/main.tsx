import ReactDOM from 'react-dom/client';
import './assets/base.css';
import React from 'react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
