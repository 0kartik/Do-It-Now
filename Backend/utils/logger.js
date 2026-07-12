import winston from "winston"
import { config } from "../config/index.js"

const jsonFormat = winston.format.combine(winston.format.timestamp(), winston.format.json())

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ""
    return `${timestamp} ${level}: ${message}${rest}`
  })
)

const transports = [new winston.transports.Console()]

if (config.isProduction) {
  transports.push(
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  )
}

const winstonLogger = winston.createLogger({
  level: config.isProduction ? "info" : "debug",
  format: config.isProduction ? jsonFormat : devFormat,
  transports
})

// Keeps the existing call signature used throughout the app: log(level, message, meta)
export function log(level, message, meta = {}) {
  winstonLogger.log(level.toLowerCase(), message, meta)
}

export { winstonLogger }
