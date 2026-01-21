import { getWeeklyCount } from "./weekUtils"

export function isWeekSuccessful(habit) {
  const count = getWeeklyCount(habit)
  return count >= 4
}