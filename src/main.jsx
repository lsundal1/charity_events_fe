import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { EventProvider } from './contexts/EventContext'
import { EventChangeProvider } from './contexts/EventChangeContext'
import App from './components/App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <EventChangeProvider>
  <UserProvider>
  <EventProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </EventProvider>
  </UserProvider>
  </EventChangeProvider>
  </BrowserRouter>
)
