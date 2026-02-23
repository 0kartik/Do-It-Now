import { log } from "../utils/logger.js"

export function errorHandler(err, req, res, next) {
log("ERROR", err.message, {
  requestId: req.requestId,
  statusCode: err.statusCode
})
  console.error(`[${req.requestId}]`, err.message)
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error"
  })
}