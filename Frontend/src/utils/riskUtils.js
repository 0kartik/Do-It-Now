import { dayDiff } from "./streakUtils"

export function getStreakRisk(habit) {
  if (!habit.lastCompletedAt) return "none"

  const gap = dayDiff(habit.lastCompletedAt)

  // Completed today
  if (gap === 0) return "none"

  // Missed today but within grace period
  if (gap === 1 && !habit.graceUsed) return "warning"

  // About to lose streak
  if (gap === 2 && !habit.graceUsed) return "critical"

  // Streak already broken
  if (gap > 2 || (gap === 2 && habit.graceUsed)) return "broken"

  return "none"
}