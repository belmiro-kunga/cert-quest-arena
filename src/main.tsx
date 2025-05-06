
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx is executing");

const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (!rootElement) {
  console.error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

console.log("Initializing React application");
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log("Render called on root element");
