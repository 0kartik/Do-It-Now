import { dayDiff } from "./streakUtils"

// Check if two timestamps fall on the same day
export function isSameDay(ts1, ts2) {
  const d1 = new Date(ts1)
  const d2 = new Date(ts2)

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

// Check if habit was completed today
export function isCompletedToday(lastCompletedAt) {
  if (!lastCompletedAt) return false
  return dayDiff(lastCompletedAt) === 0
}

// Update habit when marked as complete
export function updateHabitOnComplete(habit, now = Date.now()) {
  // If already completed today, don't update
  if (habit.lastCompletedAt && isCompletedToday(habit.lastCompletedAt)) {
    return habit
  }

  // First time completing
  if (!habit.lastCompletedAt) {
    return {
      ...habit,
      streak: 1,
      lastCompletedAt: now,
      completionHistory: [...(habit.completionHistory || []), now]
    }
  }

  const gap = dayDiff(habit.lastCompletedAt, now)

  // Completed yesterday - continue streak
  if (gap === 1) {
    return {
      ...habit,
      streak: habit.streak + 1,
      lastCompletedAt: now,
      graceUsed: false, // Reset grace when maintaining streak
      completionHistory: [...habit.completionHistory, now]
    }
  }

  // Missed 1 day but have grace period
  if (gap === 2 && !habit.graceUsed) {
    return {
      ...habit,
      streak: habit.streak + 1,
      lastCompletedAt: now,
      graceUsed: true, // Use grace period
      completionHistory: [...habit.completionHistory, now]
    }
  }

  // Streak broken - start fresh
  return {
    ...habit,
    streak: 1,
    lastCompletedAt: now,
    graceUsed: false,
    completionHistory: [...habit.completionHistory, now]
  }
}