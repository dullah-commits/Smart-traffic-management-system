import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'; 
import './index.css'

// AWS Configuration
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'YOUR_USER_POOL_ID', // e.g., us-east-1_xxxxxx
      userPoolClientId: 'YOUR_CLIENT_ID', // e.g., 2n534...
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)