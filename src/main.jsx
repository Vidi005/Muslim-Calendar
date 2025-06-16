import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'
import './styles/style.css'
import 'animate.css/animate.min.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename=''>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
