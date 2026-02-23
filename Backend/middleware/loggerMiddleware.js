
import { metrics } from "../utils/metrics.js"
  import { log } from "../utils/logger.js"

export function requestLogger(req, res, next) {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
log("INFO", "Incoming request", {
  method: req.method,
  url: req.originalUrl,
  requestId: req.requestId
})
  })

metrics.totalRequests++

  next()
}