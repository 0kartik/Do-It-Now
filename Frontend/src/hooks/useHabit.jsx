import { useState, useEffect } from "react"
import { initialHabits } from "../data/habits"
import { updateHabitOnComplete } from "../utils/habitLogic"
import { APP_CONFIG } from "../config/appConfig"

export function useHabits() {
  const [habits, setHabits] = useState(() => {
  const saved = localStorage.getItem("habits")
  return saved ? JSON.parse(saved) : initialHabits
})
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

  return {
    habits,
    completeHabit
  }
}