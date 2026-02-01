export function getFocusHabits(habits, limit = 3) {
  return [habits]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
}