import authRoutes from "./auth.js"
import habitsRoutes from "./habits.js"

export function registerRoutes(app) {
  app.use("/api/v1/auth", authRoutes)
  app.use("/api/v1/habits", habitsRoutes)
}