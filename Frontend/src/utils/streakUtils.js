// Calendar-day difference between two timestamps (ignores time-of-day),
// so "yesterday at 11pm" to "today at 6am" correctly returns 1, not 0.
export function dayDiff(ts1, ts2 = Date.now()) {
  const d1 = new Date(ts1)
  const d2 = new Date(ts2)

  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())

  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24))
}

export function calculateStreak(habit, intents) {
  const completions = intents
    .filter(e => e.type === "HABIT_COMPLETED" && e.habitId === habit.id)
    .map(e => new Date(e.timestamp))
    .sort((a, b) => b - a)

  if (completions.length === 0) return 0

  let streak = 1

  for (let i = 1; i < completions.length; i++) {
    const diff =
      (completions[i - 1] - completions[i]) / (1000 * 60 * 60 * 24)

    if (diff <= 1.5) {
      streak++
    } else if (diff <= 3) {
      // forgiveness window (1 missed day)
      continue
    } else {
      break
    }
  }

  return streak
}