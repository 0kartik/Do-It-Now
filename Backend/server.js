import "dotenv/config"
import mongoose from "mongoose"

import app from "./app.js"
import { config, assertProductionSafety } from "./config/index.js"

assertProductionSafety()

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("DB connected")
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} [${config.nodeEnv}]`)
    })
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err.message)
    process.exit(1)
  })
