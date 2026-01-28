export function getNudges({ habits, intents, trend }) {
  const nudges = []

  if (trend === "declining") {
    nudges.push("Your activity is dropping. Try completing one small habit today.")
  }

  if (habits.length > 0) {
    const inactive = habits.filter(h => !h.lastCompletedAt)
    if (inactive.length > 0) {
      nudges.push("You have habits you haven't started yet. Start with one today.")
    }
  }

  return nudges
}