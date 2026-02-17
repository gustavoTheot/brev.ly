import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './router/router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <BrowserRouter>
       <Router />
    </BrowserRouter>
  </StrictMode>,
)
