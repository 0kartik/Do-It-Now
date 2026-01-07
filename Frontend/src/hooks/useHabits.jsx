import { useState, useEffect } from "react"
import { initialHabits } from "../data/habits"
import { updateHabitOnComplete } from "../utils/habitLogic"
import { isNewDay } from "../utils/dateUtils"

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits")
    return saved ? JSON.parse(saved) : initialHabits
  })

  useEffect(() => {
  const lastOpen = localStorage.getItem("last_open_date")

  if (isNewDay(lastOpen)) {
    console.log("New day detected")
  }

  localStorage.setItem("last_open_date", Date.now())
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
    // yesterday completed → streak safe
    return
  }

  if (gap > 1) {
    habit.streak = 0
  }
})

  return {
    habits,
    completeHabit
  }
}