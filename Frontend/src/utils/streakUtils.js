export function dayDiff(from, to = Date.now()) {
  if (!from) return Infinity

  const start = new Date(from)
  const end = new Date(to)

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())

  return Math.floor((endDay - startDay) / (1000 * 60 * 60 * 24))
}