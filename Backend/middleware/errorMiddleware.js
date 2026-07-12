import { log } from "../utils/logger.js"
import { metrics } from "../utils/metrics.js"

export function errorHandler(err, req, res, next) {
  metrics.totalErrors++

  const statusCode = err.statusCode || 500

  log("ERROR", err.message, {
    requestId: req.requestId,
    statusCode
  })

  res.status(statusCode).json({
    error: err.message || "Internal Server Error"
  })
}
