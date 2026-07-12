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

// Counts HABIT_COMPLETED intent-log entries for this habit within the
// current calendar week. Uses the local intent log (rather than a
// completionHistory array on the habit itself) since that's where
// per-completion timestamps actually live now that habits are stored
// server-side.
export function getWeeklyCount(habitId, intents) {
  const { start, end } = getWeekRange()

  return intents.filter(
    i =>
      i.type === "HABIT_COMPLETED" &&
      i.habitId === habitId &&
      i.timestamp >= start.getTime() &&
      i.timestamp <= end.getTime()
  ).length
}
