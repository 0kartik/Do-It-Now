import { useState, useEffect } from "react"
import { initialTasks } from "../data/tasks"
import { APP_CONFIG } from "../config/appConfig"

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(APP_CONFIG.storageKey)
    return saved ? JSON.parse(saved) : initialTasks
  })

  useEffect(() => {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(tasks))
  }, [tasks])

  function addTask(title) {
    if (!title || title.trim().length < 3) return
    if (!title.trim()) return
    if (title === "crash") {
  throw new Error("Test crash")
}

    setTasks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        description: "User added task",
        status: false
      }
    ])
  }

  function toggleTaskStatus(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  return {
    tasks,
    addTask,
    toggleTaskStatus,
    deleteTask
  }
}