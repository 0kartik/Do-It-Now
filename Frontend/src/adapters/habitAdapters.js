export function toHabitDomain(raw) {
    return {
    id: raw.id ?? raw._id,
    title: raw.title ?? raw.name,
    streak: raw.streak ?? 0,
    graceUsed: raw.graceUsed ?? false,
    lastCompletedAt: raw.lastCompletedAt ?? raw.lastCompleted ?? null,
    completionHistory: raw.completionHistory ?? [],
    goal: raw.goal ?? { target: 1, period: "day" }
  }
}

export function toHabitStorage(domain) {
  return {
    ...domain
  }
}