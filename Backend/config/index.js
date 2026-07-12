const nodeEnv = process.env.NODE_ENV || "development"

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/do_it_now",
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret-change-me",
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtlMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  nodeEnv,
  isProduction: nodeEnv === "production",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
}

// Fail fast rather than silently run an insecure server in production.
export function assertProductionSafety() {
  if (!config.isProduction) return

  const problems = []

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "dev-only-secret-change-me") {
    problems.push("JWT_SECRET is missing or using the insecure default")
  }
  if (!process.env.MONGO_URI) {
    problems.push("MONGO_URI is not set")
  }
  if (!process.env.FRONTEND_ORIGIN) {
    problems.push("FRONTEND_ORIGIN is not set (needed for CORS + cookies)")
  }

  if (problems.length > 0) {
    console.error("Refusing to start in production due to unsafe configuration:")
    problems.forEach(p => console.error(`  - ${p}`))
    process.exit(1)
  }
}
