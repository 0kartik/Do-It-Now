const INTENT_KEY = "intent_logs"

export async function logIntent(event) {
  try {
    const logs = JSON.parse(localStorage.getItem(INTENT_KEY)) || []
    logs.push({
      ...event,
      timestamp: Date.now()
    })
    localStorage.setItem(INTENT_KEY, JSON.stringify(logs))
  } catch {
    // silently fail
  }
}
logIntent({
  type: "HABIT_RESTORED",
  habitId
})