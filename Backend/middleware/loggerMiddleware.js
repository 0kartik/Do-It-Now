import { metrics } from "../utils/metrics.js"
import { log } from "../utils/logger.js"

export function requestLogger(req, res, next) {
  metrics.totalRequests++
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
    log("INFO", "Incoming request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      requestId: req.requestId
    })
  })

  next()
}
