import { useState, useEffect } from "react"
import { initialHabits } from "../data/habits"
import { updateHabitOnComplete } from "../utils/habitLogic"
import { isNewDay } from "../utils/dateUtils"
const [loading, setLoading] = useState(true)
import { fetchHabits } from "./habitQueries"
import { saveHabits } from "./habitCommands"

export async function useHabits() {
    const success = await saveHabits(habits.map(toHabitStorage))
    if (!success) {
      console.warn("Data not saved")
    }

    localStorage.setItem(KEY, JSON.stringify(
        habits.map(toHabitStorage)
    ))

    return saved ? JSON.parse(saved) : initialHabits
  }

  useEffect(() => {
  const lastOpen = localStorage.getItem("last_open_date")

  if (isNewDay(lastOpen)) {
    console.log("New day detected")
  }

  localStorage.setItem("last_open_date", Date.now())
}, [])

  useEffect(() => {
  async function load() {
    setLoading(true)
    const raw = await fetchHabits()
    setHabits(raw.map(toHabitDomain))
    setLoading(false)
  }
  load()
}, [])


  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  function completeHabit(id) {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? updateHabitOnComplete(habit)
          : habit
      )
    )
  }

  habits.forEach(habit => {
  const gap = dayDiff(habit.lastCompletedAt)

if (gap === 1) {
  return
}

if (gap === 2 && !habit.graceUsed) {
  habit.graceUsed = true
  return
}

if (gap > 2) {
  habit.streak = 0
  habit.graceUsed = false
}
})

  return {
    habits,
    completeHabit
  }