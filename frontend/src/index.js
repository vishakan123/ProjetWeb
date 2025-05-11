// src/index.js (ou main.js)

import React from 'react';
import ReactDOM from 'react-dom/client'; // ou juste 'react-dom' pour les anciennes versions de React
import './index.css'; // Tes styles globaux
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'; // Si tu as ton Router ici
import { AuthProvider } from './contexts/AuthContext'; // <--- 1. IMPORTE AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Si BrowserRouter est ici, sinon tu peux l'avoir dans App.js */}
      <AuthProvider> {/* <--- 2. ENVELOPPE App AVEC AuthProvider */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();