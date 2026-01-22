import { useState, useEffect } from "react"
import { initialTasks } from "../data/tasks"
import { saveTasks, fetchTasks, logIntent } from "src/services/storageService"

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Load tasks on mount
  useEffect(() => {
    async function loadTasks() {
      setLoading(true)
      try {
        const loadedTasks = await fetchTasks()
        setTasks(loadedTasks.length > 0 ? loadedTasks : initialTasks)
        
        await logIntent({
          type: "TASKS_LOADED",
          count: loadedTasks.length
        })
      } catch (error) {
        console.error("Failed to load tasks:", error)
        setTasks(initialTasks)
      }
      setLoading(false)
    }
    
    loadTasks()
  }, [])

  // Save tasks whenever they change
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks)
    }
  }, [tasks, loading])

  async function addTask(title) {
    if (!title || title.trim().length < 3) return
    
    if (title === "crash") {
      throw new Error("Test crash")
    }

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: "User added task",
      status: false,
      createdAt: Date.now()
    }

    await logIntent({
      type: "TASK_CREATED",
      taskId: newTask.id,
      title: newTask.title
    })

    setTasks(prev => [...prev, newTask])
  }

  async function toggleTaskStatus(id) {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const newStatus = !task.status
          
          logIntent({
            type: newStatus ? "TASK_COMPLETED" : "TASK_UNCOMPLETED",
            taskId: id,
            title: task.title
          })
          
          return { 
            ...task, 
            status: newStatus,
            completedAt: newStatus ? Date.now() : null
          }
        }
        return task
      })
    )
  }

  async function deleteTask(id) {
    const task = tasks.find(t => t.id === id)
    
    if (task) {
      await logIntent({
        type: "TASK_DELETED",
        taskId: id,
        title: task.title
      })
    }
    
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  return {
    tasks,
    loading,
    addTask,
    toggleTaskStatus,
    deleteTask
  }
}