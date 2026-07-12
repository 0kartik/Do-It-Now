import { describe, it, expect } from "vitest"
import { isSameDay, isCompletedToday, updateHabitOnComplete } from "../habitLogic"

describe("isSameDay", () => {
  it("returns true for the same calendar day", () => {
    expect(isSameDay("2026-07-10T01:00:00", "2026-07-10T23:00:00")).toBe(true)
  })

  it("returns false across midnight", () => {
    expect(isSameDay("2026-07-10T23:59:00", "2026-07-11T00:01:00")).toBe(false)
  })
})

describe("isCompletedToday", () => {
  it("returns false when never completed", () => {
    expect(isCompletedToday(null)).toBe(false)
  })

  it("returns true when completed a moment ago", () => {
    expect(isCompletedToday(Date.now())).toBe(true)
  })
})

describe("updateHabitOnComplete", () => {
  const dayMs = 24 * 60 * 60 * 1000

  it("starts a new streak on first completion", () => {
    const habit = { lastCompletedAt: null, streak: 0, graceUsed: false, completionHistory: [] }
    const result = updateHabitOnComplete(habit)
    expect(result.streak).toBe(1)
  })

  it("does not change anything if already completed today", () => {
    const now = Date.now()
    const habit = { lastCompletedAt: now, streak: 3, graceUsed: false, completionHistory: [now] }
    const result = updateHabitOnComplete(habit, now)
    expect(result).toBe(habit) // same reference - true no-op
  })

  it("continues the streak after exactly one day", () => {
    const yesterday = Date.now() - dayMs
    const habit = { lastCompletedAt: yesterday, streak: 3, graceUsed: false, completionHistory: [yesterday] }
    const result = updateHabitOnComplete(habit)
    expect(result.streak).toBe(4)
  })

  it("uses the grace day after a two-day gap if not already used", () => {
    const twoDaysAgo = Date.now() - 2 * dayMs
    const habit = { lastCompletedAt: twoDaysAgo, streak: 5, graceUsed: false, completionHistory: [twoDaysAgo] }
    const result = updateHabitOnComplete(habit)
    expect(result.streak).toBe(6)
    expect(result.graceUsed).toBe(true)
  })

  it("resets the streak if the grace day was already used", () => {
    const twoDaysAgo = Date.now() - 2 * dayMs
    const habit = { lastCompletedAt: twoDaysAgo, streak: 5, graceUsed: true, completionHistory: [twoDaysAgo] }
    const result = updateHabitOnComplete(habit)
    expect(result.streak).toBe(1)
  })

  it("resets the streak after a long gap", () => {
    const fiveDaysAgo = Date.now() - 5 * dayMs
    const habit = { lastCompletedAt: fiveDaysAgo, streak: 10, graceUsed: false, completionHistory: [fiveDaysAgo] }
    const result = updateHabitOnComplete(habit)
    expect(result.streak).toBe(1)
  })
})
