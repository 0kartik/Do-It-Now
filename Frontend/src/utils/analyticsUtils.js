export function countIntent(intents, type) {
  return intents.filter(i => i.type === type).length
}
export function getWeightedCompletions(intents, habits) {
  const map = {}

  intents.forEach(event => {
    if (event.type === "HABIT_COMPLETED") {
      const habit = habits.find(h => h.id === event.habitId)
      const weight = habit?.effort || 1

      map[event.habitId] = (map[event.habitId] || 0) + weight
    }
  })

  return map
}

export function getHabitsCompletionMap(intents) {
  return intents.reduce((map, event) => {
    if (event.type === "HABIT_COMPLETED") {
      map[event.habitId] = (map[event.habitId] || 0) + 1
    }
    return map
  }, {})
}