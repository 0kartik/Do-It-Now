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