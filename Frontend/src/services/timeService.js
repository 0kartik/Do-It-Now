export function now() {
  return Date.now()
}

export function today() {
  const d = new Date(now())
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}