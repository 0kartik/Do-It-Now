import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext"
import { TasksProvider } from "./context/TasksContext"
import { HabitsProvider } from "./context/HabitsContext"
import "./styles/global.css"
import ErrorBoundary from "./components/ErrorBoundary"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <HabitsProvider>
              <App />
            </HabitsProvider>
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)