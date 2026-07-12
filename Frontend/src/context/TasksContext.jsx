import { createContext, useContext } from "react"
import { useTasks } from "../hooks/usetasks"

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const tasksState = useTasks()

  return (
    <TasksContext.Provider value={tasksState}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasksContext() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error("useTasksContext must be used inside TasksProvider")
  }
  return context
}
