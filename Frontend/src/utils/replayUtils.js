export function replayIntents(intents) {
  return intents.reduce((state, event) => {
    switch (event.type) {
      case "HABIT_COMPLETED":
        state[event.habitId] = (state[event.habitId] || 0) + 1
        break
      default:
        break
    }
    return state
  }, {})
}