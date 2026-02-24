import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import { UIProvider } from './contexts/AuthModalContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <App />
          <Toaster position="top-right" />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
