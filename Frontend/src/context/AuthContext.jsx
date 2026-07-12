import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { authApi } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while we check for an existing session
  const [error, setError] = useState(null)

  // On load, ask the server if our httpOnly cookies still represent a valid
  // session - we never store the token client-side, so this is the only
  // way to know if the user is logged in after a page refresh.
  useEffect(() => {
    authApi
      .me()
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const register = useCallback(async (name, email, password) => {
    setError(null)
    try {
      const data = await authApi.register(name, email, password)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const data = await authApi.login(email, password)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // clear local state regardless - cookies get cleared server-side even on error paths
    }
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    error,
    register,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
