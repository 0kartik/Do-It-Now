export function countIntent(intents, type) {
  return intents.filter(i => i.type === type).length
}

export function getHabitsCompletionMap(intents) {
  return intents.reduce((map, event) => {
    if (event.type === "HABIT_COMPLETED") {
      map[event.habitId] = (map[event.habitId] || 0) + 1
    }
    return map
  }, {})
}