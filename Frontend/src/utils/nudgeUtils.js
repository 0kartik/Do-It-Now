import { getStreakRisk } from "./riskUtils"

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

    const critical = habits.filter(h => h.streak > 0 && getStreakRisk(h) === "critical")
    critical.forEach(h => {
      nudges.push(`"${h.title}" is about to lose its ${h.streak}-day streak — complete it today!`)
    })
  }

  return nudges
}
