import rateLimit, { ipKeyGenerator } from "express-rate-limit"

// Tighter limit on writes, keyed per authenticated user (not just per-IP),
// so one user can't exhaust the quota for everyone behind the same NAT/office IP.
// Falls back to IP if req.userId isn't set yet (shouldn't happen since this
// is always applied after authMiddleware on protected routes).
export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => req.userId || ipKeyGenerator(req.ip)
})
