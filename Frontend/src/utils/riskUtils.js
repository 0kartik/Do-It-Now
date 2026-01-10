export function getStreakRisk(habit) {
  if (!habit.lastCompletedAt) return "none"
  dayDiff(lastCompletedAt) >= 1

  const gap = dayDiff(habit.lastCompletedAt)

  if (gap === 1 && !habit.graceUsed) return "warning"
  if (gap === 2 && !habit.graceUsed) return "critical"

  return "none"
}