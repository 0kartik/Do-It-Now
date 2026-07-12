export function getGoalProgress(habit, intents) {
  const now = new Date()

  let start

  if (habit.goal.period === "day") {
    start = new Date(now.setHours(0,0,0,0))
  }

  if (habit.goal.period === "week") {
    start = new Date(now.setDate(now.getDate() - 7))
  }

  if (habit.goal.period === "month") {
    start = new Date(now.setDate(now.getDate() - 30))
  }

  const count = intents.filter(e =>
    e.type === "HABIT_COMPLETED" &&
    e.habitId === habit.id &&
    new Date(e.timestamp) >= start
  ).length

  return {
    done: count,
    target: habit.goal.target,
    percent: Math.min(100, (count / habit.goal.target) * 100)
  }
}