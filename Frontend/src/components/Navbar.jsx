import { Link } from "react-router-dom"

export default function NavBar() {
  return (
    <nav>
      <Link to="/">Today</Link> |{" "}
      <Link to="/stats">Stats</Link> |{" "}
      <Link to="/settings">Settings</Link>
    </nav>
  )
}