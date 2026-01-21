import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Today from './pages/Today'
import Settings from "./pages/Settings"
import Habits from './pages/Habits'
import Analytics from './pages/Analytics'
import Header from './components/Header'
import { APP_CONFIG } from './config/appConfig'

function App() {
  return (
    <>
      <Header />
      <h1>{APP_CONFIG.appName}</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/today" element={<Today />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  )
}

export default App