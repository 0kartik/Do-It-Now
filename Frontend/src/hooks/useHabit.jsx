import { useState } from "react"
import { initialHabits } from "../data/habits"
import { updateHabitOnComplete } from "../utils/habitLogic"

export function useHabits() {
  const [habits, setHabits] = useState(initialHabits)

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