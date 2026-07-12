import authRoutes from "./auth.js"
import habitsRoutes from "./habits.js"
import tasksRoutes from "./tasks.js"

export function registerRoutes(app) {
  app.get("/health", (req, res) => {
    res.json({ status: "OK", uptime: process.uptime() })
  })

  app.use("/api/v1/auth", authRoutes)
  app.use("/api/v1/habits", habitsRoutes)
  app.use("/api/v1/tasks", tasksRoutes)
}
