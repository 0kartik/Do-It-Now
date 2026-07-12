import { describe, it, expect } from "vitest"
import { getStreakRisk } from "../riskUtils"

const dayMs = 24 * 60 * 60 * 1000

describe("getStreakRisk", () => {
  it("returns 'none' when never completed", () => {
    expect(getStreakRisk({ lastCompletedAt: null, graceUsed: false })).toBe("none")
  })

  it("returns 'none' when completed today", () => {
    expect(getStreakRisk({ lastCompletedAt: Date.now(), graceUsed: false })).toBe("none")
  })

  it("returns 'warning' one day after, with grace still available", () => {
    const habit = { lastCompletedAt: Date.now() - dayMs, graceUsed: false }
    expect(getStreakRisk(habit)).toBe("warning")
  })

  it("returns 'critical' two days after, with grace still available", () => {
    const habit = { lastCompletedAt: Date.now() - 2 * dayMs, graceUsed: false }
    expect(getStreakRisk(habit)).toBe("critical")
  })

  it("returns 'broken' two days after if grace was already used", () => {
    const habit = { lastCompletedAt: Date.now() - 2 * dayMs, graceUsed: true }
    expect(getStreakRisk(habit)).toBe("broken")
  })

  it("returns 'broken' after a long gap", () => {
    const habit = { lastCompletedAt: Date.now() - 5 * dayMs, graceUsed: false }
    expect(getStreakRisk(habit)).toBe("broken")
  })
})
