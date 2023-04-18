import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WorldMap from './WorldMap';
import reportWebVitals from './reportWebVitals';
import './fonts.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WorldMap />
  </React.StrictMode>
);

reportWebVitals();
