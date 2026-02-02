import express from "express"
import cors from "cors"

import habitsRoutes from "./routes/habits.js"
app.use("/habits", habitsRoutes)
const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API running")
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})