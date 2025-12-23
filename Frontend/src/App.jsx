import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Today from './pages/Today'
import Header from './components/Header'

function App() {
  return (
    <>
      <Header />
        <h1>{APP_CONFIG.appName}</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/today" element={<Today />} />
      </Routes>
    </>
  )
}

export default App
