import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import swaggerUi from "swagger-ui-express"

import { registerRoutes } from "./routes/index.js"
import { errorHandler } from "./middleware/errorMiddleware.js"
import { requestLogger } from "./middleware/loggerMiddleware.js"
import { sanitizeInputs } from "./middleware/sanitizeMiddleware.js"
import { requestId } from "./utils/requestId.js"
import { metrics } from "./utils/metrics.js"
import { swaggerSpec } from "./config/swagger.js"
import { config } from "./config/index.js"

const app = express()

app.disable("x-powered-by")
app.set("trust proxy", 1) // needed for correct rate-limit/IP behavior behind Render/Railway/etc proxies

app.use(helmet())
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(sanitizeInputs)
app.use(requestId)
app.use(requestLogger)

// General ceiling for anonymous/global traffic
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
})
app.use(globalLimiter)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/metrics", (req, res) => {
  res.json({
    uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
    totalRequests: metrics.totalRequests,
    totalErrors: metrics.totalErrors
  })
})

registerRoutes(app)

app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})

app.use(errorHandler)

process.on("unhandledRejection", err => {
  console.error("Unhandled Rejection:", err)
})

export default app
