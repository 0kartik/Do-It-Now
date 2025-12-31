import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { TasksProvider } from "./context/TasksContext"
import "./styles/global.css"
import ErrorBoundary from "./components/ErrorBoundary"
import { useTasks } from './hooks/usetasks.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <TasksProvider>
          <App />
      </TasksProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)