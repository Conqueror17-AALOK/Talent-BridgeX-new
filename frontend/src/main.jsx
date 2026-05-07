import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <App />
          <Toaster position="bottom-right" expand={false} richColors theme="light" />
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
