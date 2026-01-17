const STORAGE_KEY = "habits"

export async function fetchHabits() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(raw)) throw new Error("Corrupted data")
    return raw
  } catch {
    return []
  }
}
