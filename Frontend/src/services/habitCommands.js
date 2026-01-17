const STORAGE_KEY = "habits"

export async function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
    return true
  } catch {
    return false
  }
}