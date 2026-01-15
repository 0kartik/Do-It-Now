export async function fetchHabits() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(raw)) throw new Error("Corrupted data")
    return raw
  } catch (e) {
    console.error("Failed to fetch habits", e)
    return []
  }
}

export async function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
    return true
  } catch (e) {
    console.error("Failed to save habits", e)
    return false
  }
}