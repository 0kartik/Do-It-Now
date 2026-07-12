import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Still checking for an existing session (e.g. right after a page refresh) -
  // avoid a flash-redirect to /login before we actually know.
  if (loading) return null

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
