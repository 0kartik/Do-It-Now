import { Link } from "react-router-dom"

export default function Header() {
  return (
    <nav style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "15px 20px",
      borderRadius: "8px",
      marginBottom: "20px"
    }}>
      <div style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <NavLink to="/">🏠 Home</NavLink>
        <NavLink to="/today">📋 Today</NavLink>
        <NavLink to="/habits">🔥 Habits</NavLink>
        <NavLink to="/analytics">📊 Analytics</NavLink>
        <NavLink to="/settings">⚙️ Settings</NavLink>
      </div>
    </nav>
  )
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: "white",
        textDecoration: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        fontWeight: "500",
        transition: "background 0.3s",
        background: "rgba(255, 255, 255, 0.1)"
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "rgba(255, 255, 255, 0.2)"
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "rgba(255, 255, 255, 0.1)"
      }}
    >
      {children}
    </Link>
  )
}