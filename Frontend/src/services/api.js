const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

let refreshInFlight = null

async function rawRequest(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include", // send/receive the httpOnly auth cookies
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message =
      data?.error ||
      data?.errors?.[0]?.msg ||
      "Something went wrong talking to the server"
    throw new ApiError(message, res.status)
  }

  return data
}

// Wraps rawRequest: on a 401 (expired access token), tries the refresh
// endpoint once and retries the original request before giving up.
async function request(path, options = {}) {
  try {
    return await rawRequest(path, options)
  } catch (err) {
    const isAuthRoute = path.startsWith("/auth/")
    if (err.status !== 401 || isAuthRoute) throw err

    refreshInFlight ??= rawRequest("/auth/refresh", { method: "POST" }).finally(() => {
      refreshInFlight = null
    })

    try {
      await refreshInFlight
    } catch {
      throw err // refresh failed too - surface the original 401
    }

    return rawRequest(path, options)
  }
}

// ---- Auth ----
export const authApi = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me")
}

// ---- Habits ----
export const habitsApi = {
  list: params => request(`/habits${toQueryString(params)}`),
  create: (name, extra = {}) => request("/habits", { method: "POST", body: { name, ...extra } }),
  update: (id, changes) => request(`/habits/${id}`, { method: "PUT", body: changes }),
  remove: id => request(`/habits/${id}`, { method: "DELETE" }),
  complete: id => request(`/habits/${id}/complete`, { method: "PATCH" })
}

// ---- Tasks ----
export const tasksApi = {
  list: params => request(`/tasks${toQueryString(params)}`),
  create: (title, extra = {}) => request("/tasks", { method: "POST", body: { title, ...extra } }),
  update: (id, changes) => request(`/tasks/${id}`, { method: "PUT", body: changes }),
  remove: id => request(`/tasks/${id}`, { method: "DELETE" })
}

function toQueryString(params) {
  if (!params) return ""
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  if (entries.length === 0) return ""
  return `?${new URLSearchParams(entries).toString()}`
}

export { ApiError }
