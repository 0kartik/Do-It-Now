import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { TasksProvider } from "./context/TasksContext"



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TasksProvider>
          <App />
      </TasksProvider>
    </BrowserRouter>
  </StrictMode>,
)