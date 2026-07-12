// Strips keys starting with "$" or containing "." from req.body/params/query,
// which prevents NoSQL operator injection (e.g. { "email": { "$gt": "" } }).
// Written by hand instead of using express-mongo-sanitize because that
// package mutates req.query directly, which Express 5 makes read-only.

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (value && typeof value === "object") {
    const clean = {}
    for (const key of Object.keys(value)) {
      if (key.startsWith("$") || key.includes(".")) continue
      clean[key] = sanitizeValue(value[key])
    }
    return clean
  }

  return value
}

export function sanitizeInputs(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body)
  if (req.params) req.params = sanitizeValue(req.params)

  // req.query is read-only in Express 5 - sanitize in place instead of reassigning
  if (req.query) {
    const cleaned = sanitizeValue(req.query)
    for (const key of Object.keys(req.query)) {
      if (!(key in cleaned)) delete req.query[key]
    }
    Object.assign(req.query, cleaned)
  }

  next()
}
