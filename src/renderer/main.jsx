import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App.jsx';
import './styles.css';
import '/src/i18n/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
