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
export function isCompletedToday(date) {
  if (!date) return false
  return dayDiff(date) === 0
}

export function updateHabitOnComplete(habit, now = Date.now()) {
  if (!habit.lastCompleted) {
    return {
      ...habit,
      streak: 1,
      lastCompleted: now
    }
  }

  if (isSameDay(habit.lastCompleted, now)) {
    return habit // already completed today
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (isSameDay(habit.lastCompleted, yesterday.getTime())) {
    return {
      ...habit,
      streak: habit.streak + 1,
      lastCompleted: now
    }
  }

  return {
    ...habit,
    streak: 1,
    lastCompleted: now
  }
}