import { now } from "../services/timeService"

const DAY = 24 * 60 * 60 * 1000

export function getLastNDaysIntents(intents, days) {
  const cutoff = now() - days * DAY
  return intents.filter(i => i.timestamp >= cutoff)
}

export function compareTrends(intents, type, days = 7) {
  const recent = getLastNDaysIntents(intents, days)
  const previous = intents.filter(
    i => i.timestamp < now() - days * DAY &&
         i.timestamp >= now() - 2 * days * DAY
  )

  const recentCount = recent.filter(i => i.type === type).length
  const previousCount = previous.filter(i => i.type === type).length

  if (previousCount === 0) return "stable"

  if (recentCount > previousCount) return "improving"
  if (recentCount < previousCount) return "declining"

  return "stable"
}