export function toHabitDomain(raw) {
    return {
    id: raw.id,
    title: raw.title,
    streak: raw.streak ?? 0,
    graceUsed: raw.graceUsed ?? false,
    lastCompletedAt: raw.lastCompletedAt ?? null,
    completionHistory: raw.completionHistory ?? []
  }
}

export function toHabitStorage(domain) {
  return {
    ...domain
  }
}