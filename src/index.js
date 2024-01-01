import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ContextShare from './ContextAPI/ContextShare';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextShare>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextShare>
  </React.StrictMode>
);


