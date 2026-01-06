export function isNewDay(lastDate, now = Date.now()) {
  if (!lastDate) return true

  const last = new Date(lastDate)
  const current = new Date(now)

  return (
    last.getFullYear() !== current.getFullYear() ||
    last.getMonth() !== current.getMonth() ||
    last.getDate() !== current.getDate()
  )
}