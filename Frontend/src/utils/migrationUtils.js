export function migrateHabits(rawHabits) {
  return rawHabits.map(h => ({
    graceUsed: false,
    completionHistory: [],
    isArchived: false,
    ...h
  }))
}