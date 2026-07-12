import { useState } from 'react'
import { NavLink, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Today from './pages/Today'
import Settings from './pages/Settings'
import Habits from './pages/Habits'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import { APP_CONFIG } from './config/appConfig'
import { useAuth } from './context/AuthContext'
import './App.css'

const navItems = [
  { to: '/', label: 'Home', icon: <HomeIcon /> },
  { to: '/today', label: 'Today', icon: <TodayIcon /> },
  { to: '/habits', label: 'Habits', icon: <HabitsIcon /> },
  { to: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
]

function App() {
  const { isAuthenticated, user, logout } = useAuth()
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const location = useLocation()

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  const pageMeta = {
    '/': { title: 'Overview', description: 'A calm command center for your day' },
    '/today': { title: 'Today', description: 'Your current focus and deadlines' },
    '/habits': { title: 'Habits', description: 'Consistency loops that keep you moving' },
    '/analytics': { title: 'Analytics', description: 'Patterns and momentum over time' },
    '/settings': { title: 'Settings', description: 'Personalize your workflow' },
    '/login': { title: 'Welcome back', description: 'Sign in to continue' },
  }

  const currentMeta = pageMeta[location.pathname] || pageMeta['/']

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="brand-mark">D</div>
          <div>
            <p className="brand-name">{APP_CONFIG.appName}</p>
            <p className="brand-subtitle">Focus OS</p>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__footer-card">
            <p className="sidebar__footer-label">word of the day</p>
            <p className="sidebar__footer-copy">Keep the streak alive today.</p>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuToggle={() => setSidebarOpen((value) => !value)}
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
          avatarMenuOpen={avatarMenuOpen}
          setAvatarMenuOpen={setAvatarMenuOpen}
        />

        <main className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{currentMeta.title}</p>
              <h1 className="page-title">{APP_CONFIG.appName}</h1>
              <p className="page-description">{currentMeta.description}</p>
            </div>
            {isAuthenticated && <div className="page-pill">Live sync enabled</div>}
          </section>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/today" element={<ProtectedRoute><Today /></ProtectedRoute>} />
            <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function TodayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v2M17 3v2M4 8h16M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

function HabitsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 12.5 11 15l5-6" />
      <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 18V10" />
      <path d="M12 18V6" />
      <path d="M19 18v-7" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 1 0 12 8.5Z" />
      <path d="M19 12a7 7 0 0 0-.1-1.1l1.9-1.5-2-3.5-2.3 1a7 7 0 0 0-1.9-1.1L14 2h-4l-.6 2.3a7 7 0 0 0-1.9 1.1l-2.3-1-2 3.5 1.9 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.1l-1.9 1.5 2 3.5 2.3-1a7 7 0 0 0 1.9 1.1L10 22h4l.6-2.3a7 7 0 0 0 1.9-1.1l2.3 1 2-3.5-1.9-1.5c.1-.4.1-.7.1-1.1Z" />
    </svg>
  )
}

export default App