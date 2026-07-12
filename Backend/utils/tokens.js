import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { config } from "../config/index.js"

export function signAccessToken(userId) {
  return jwt.sign({ id: userId, type: "access" }, config.jwtSecret, {
    expiresIn: config.accessTokenTtl
  })
}

export function signRefreshToken(userId) {
  return jwt.sign({ id: userId, type: "refresh" }, config.jwtSecret, {
    expiresIn: Math.floor(config.refreshTokenTtlMs / 1000)
  })
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret)
}

export async function hashRefreshToken(token) {
  return bcrypt.hash(token, 10)
}

export async function compareRefreshToken(token, hash) {
  if (!hash) return false
  return bcrypt.compare(token, hash)
}

const isProduction = config.isProduction

export const accessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 15 * 60 * 1000
}

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: config.refreshTokenTtlMs
}

export function clearAuthCookies(res) {
  res.clearCookie("accessToken", accessCookieOptions)
  res.clearCookie("refreshToken", refreshCookieOptions)
}
