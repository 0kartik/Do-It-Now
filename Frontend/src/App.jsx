import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Today from './pages/Today'
import Stats from "./pages/Stats"
import Settings from "./pages/Settings"
import Header from './components/Header'
import { APP_CONFIG } from './config/appConfig'

function App() {
  return (
    <>
      <Header />
      <h1>{APP_CONFIG.appName}</h1>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/today" element={<Today />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App