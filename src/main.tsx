import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import { App } from './ui/App';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
