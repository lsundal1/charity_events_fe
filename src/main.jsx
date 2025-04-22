import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { EventProvider } from './contexts/EventContext'
import App from './components/App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserProvider>
  <EventProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </EventProvider>
  </UserProvider>
  </BrowserRouter>
)
