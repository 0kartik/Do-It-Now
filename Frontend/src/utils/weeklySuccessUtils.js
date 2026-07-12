import { getWeeklyCount } from "./weekUtils"

const WEEKLY_SUCCESS_THRESHOLD = 4

export function isWeekSuccessful(habitId, intents) {
  return getWeeklyCount(habitId, intents) >= WEEKLY_SUCCESS_THRESHOLD
}
