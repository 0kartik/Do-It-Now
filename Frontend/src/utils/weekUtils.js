export function getWeekRange(date = Date.now()) {
  const d = new Date(date)
  const day = d.getDay() || 7 // make Sunday = 7
  const start = new Date(d)
  start.setDate(d.getDate() - day + 1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}
export function getWeeklyCount(habit) {
  const { start, end } = getWeekRange()

  return habit.completionHistory.filter(ts =>
    ts >= start && ts <= end
  ).length
}