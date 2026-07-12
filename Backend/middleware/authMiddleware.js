import { verifyToken } from "../utils/tokens.js"

export function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1]

  if (!token) return res.status(401).json({ error: "No access token provided" })

  try {
    const decoded = verifyToken(token)
    if (decoded.type !== "access") {
      return res.status(401).json({ error: "Invalid token type" })
    }
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired access token" })
  }
}
