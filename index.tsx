
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Since we are not creating an index.css file, imports are not needed.
// Global styles are handled by Tailwind CDN in index.html.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
