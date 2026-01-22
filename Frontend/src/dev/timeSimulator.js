import { setNow, resetNow } from "../services/timeService"

export function simulateDayOffset(days) {
  const base = Date.now()
  setNow(() => base + days * 24 * 60 * 60 * 1000)
}

export function resetTime() {
  resetNow()
}