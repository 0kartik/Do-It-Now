import { describe, it, expect } from "vitest"
import { dayDiff } from "../streakUtils"

describe("dayDiff", () => {
  it("returns 0 for timestamps on the same calendar day", () => {
    expect(dayDiff("2026-07-10T02:00:00", "2026-07-10T22:00:00")).toBe(0)
  })

  it("returns 1 for consecutive calendar days regardless of time-of-day", () => {
    expect(dayDiff("2026-07-09T23:00:00", "2026-07-10T06:00:00")).toBe(1)
  })

  it("returns a negative number when the second date is earlier", () => {
    expect(dayDiff("2026-07-10", "2026-07-08")).toBe(-2)
  })
})
