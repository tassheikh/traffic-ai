import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import "leaflet/dist/leaflet.css";

// 🔥 Import Context Provider
import { TrafficProvider } from './context/TrafficContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    {/* 🔥 Global State Wrapper */}
    <TrafficProvider>

      <BrowserRouter>
        <App />
      </BrowserRouter>

    </TrafficProvider>

  </React.StrictMode>,
);