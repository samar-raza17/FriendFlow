import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ToggleProvider from './Context/ToggleProvider.jsx'
import BarsProvider from './Context/BarsProvider.jsx'
import UploaderProvider from './Context/UploaderProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './Context/AuthProvider.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <ToggleProvider>
      <BarsProvider>
        <UploaderProvider>
        <App />
        </UploaderProvider>
      </BarsProvider>
    </ToggleProvider>
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
