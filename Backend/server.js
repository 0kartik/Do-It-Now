import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.js"
app.use("/api/v1/auth", authRoutes)

import { registerRoutes } from "./routes/index.js"
registerRoutes(app)

import { processJobs } from "./utils/jobQueue.js"

processJobs()

import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger.js"

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

import habitsRoutes from "./routes/habits.js"
app.use("/api/v1/habits", habitsRoutes)
import mongoose from "mongoose"

mongoose.connect("mongodb://127.0.0.1:27017/consistency_app")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err))

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API running")
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})

import { errorHandler } from "./middleware/errorMiddleware.js"
app.use(errorHandler)
import { requestLogger } from "./middleware/loggerMiddleware.js"
app.use(requestLogger)
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try later"
})

const PORT = process.env.PORT || 5000
app.disable("x-powered-by")

app.use(limiter)
app.use("/api/v1/auth", authLimiter)