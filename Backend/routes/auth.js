import express from "express"
import bcrypt from "bcryptjs"
import { body, validationResult } from "express-validator"
import rateLimit from "express-rate-limit"

import User from "../Models/User.js"
import { AppError } from "../utils/AppError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  hashRefreshToken,
  compareRefreshToken,
  accessCookieOptions,
  refreshCookieOptions,
  clearAuthCookies
} from "../utils/tokens.js"

const router = express.Router()

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many auth attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false
})

async function issueSession(res, user) {
  const accessToken = signAccessToken(user._id)
  const refreshToken = signRefreshToken(user._id)

  user.refreshTokenHash = await hashRefreshToken(refreshToken)
  user.refreshTokenExpiresAt = new Date(Date.now() + refreshCookieOptions.maxAge)
  await user.save()

  res.cookie("accessToken", accessToken, accessCookieOptions)
  res.cookie("refreshToken", refreshToken, refreshCookieOptions)
}

router.post(
  "/register",
  authLimiter,
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required")
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) throw new AppError("An account with this email already exists", 409)

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    await issueSession(res, user)

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } })
  })
)

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) throw new AppError("Invalid email or password", 401)

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) throw new AppError("Invalid email or password", 401)

    await issueSession(res, user)

    res.json({ user: { id: user._id, name: user.name, email: user.email } })
  })
)

// Exchanges a valid refresh token cookie for a new access token.
// The frontend calls this automatically whenever a request comes back 401.
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) throw new AppError("No refresh token provided", 401)

    let payload
    try {
      payload = verifyToken(refreshToken)
    } catch {
      clearAuthCookies(res)
      throw new AppError("Refresh token invalid or expired", 401)
    }

    const user = await User.findById(payload.id)
    if (!user) {
      clearAuthCookies(res)
      throw new AppError("User no longer exists", 401)
    }

    const matches = await compareRefreshToken(refreshToken, user.refreshTokenHash)
    if (!matches) {
      clearAuthCookies(res)
      throw new AppError("Refresh token has been revoked", 401)
    }

    // Rotate the refresh token on every use so a leaked token has a short shelf life.
    await issueSession(res, user)

    res.json({ user: { id: user._id, name: user.name, email: user.email } })
  })
)

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
      try {
        const payload = verifyToken(refreshToken)
        await User.findByIdAndUpdate(payload.id, {
          refreshTokenHash: null,
          refreshTokenExpiresAt: null
        })
      } catch {
        // token already invalid/expired - nothing to revoke
      }
    }

    clearAuthCookies(res)
    res.json({ success: true })
  })
)

router.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId)
    if (!user) throw new AppError("User not found", 404)

    res.json({ user: { id: user._id, name: user.name, email: user.email } })
  })
)

export default router
