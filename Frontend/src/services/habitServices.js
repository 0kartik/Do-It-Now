const STORAGE_KEY = "habits"

export async function fetchHabits() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  return raw
}

export async function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  return true
}