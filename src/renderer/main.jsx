import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App.jsx';
import './styles/base.css';
import './styles/dashboard.css';
import './styles/todo-list.css';
import './styles/calendar.css';
import './styles/timer.css';
import './styles/history.css';
import './styles/login.css';
import '/src/i18n/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
