import crypto from "crypto"

export function requestId(req, res, next) {
  req.requestId = crypto.randomUUID()
  next()
}
