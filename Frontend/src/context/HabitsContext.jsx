import { createContext, useContext } from "react"
import { useHabits } from "../hooks/useHabits"

const HabitsContext = createContext(null)

export function HabitsProvider({ children }) {
  const habitsState = useHabits()

  return (
    <HabitsContext.Provider value={habitsState}>
      {children}
    </HabitsContext.Provider>
  )
}

export function useHabitsContext() {
  const context = useContext(HabitsContext)
  if (!context) {
    throw new Error("useHabitsContext must be used inside HabitsProvider")
  }
  return context
}