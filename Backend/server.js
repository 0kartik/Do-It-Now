import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.js"
app.use("/auth", authRoutes)

import habitsRoutes from "./routes/habits.js"
app.use("/habits", habitsRoutes)
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