import { useState, useEffect, useCallback } from "react"
import { tasksApi } from "../services/api"
import { logIntent } from "../services/storageServices"
import { useAuth } from "../context/AuthContext"

function toTaskDomain(raw) {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description ?? "",
    status: raw.status === "done",
    priority: raw.priority ?? "medium",
    dueDate: raw.dueDate ?? null,
    createdAt: raw.createdAt
  }
}

export function useTasks() {
  const { isAuthenticated } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  const loadTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await tasksApi.list({ search, limit: 100 })
      setTasks(res.data.map(toTaskDomain))
    } catch (err) {
      console.error("Failed to load tasks:", err)
      setError(err.message)
    }
    setLoading(false)
  }, [isAuthenticated, search])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function addTask(title, extra = {}) {
    if (!title || title.trim().length < 3) return

    try {
      const created = await tasksApi.create(title.trim(), extra)
      setTasks(prev => [...prev, toTaskDomain(created)])

      logIntent({ type: "TASK_CREATED", taskId: created._id, title: created.title })
    } catch (err) {
      console.error("Failed to add task:", err)
      setError(err.message)
    }
  }

  async function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const nextStatus = task.status ? "pending" : "done"

    try {
      const updated = await tasksApi.update(id, { status: nextStatus })
      setTasks(prev => prev.map(t => (t.id === id ? toTaskDomain(updated) : t)))

      logIntent({
        type: nextStatus === "done" ? "TASK_COMPLETED" : "TASK_UNCOMPLETED",
        taskId: id,
        title: task.title
      })
    } catch (err) {
      console.error("Failed to update task:", err)
      setError(err.message)
    }
  }

  async function updateTask(id, changes) {
    try {
      const updated = await tasksApi.update(id, changes)
      setTasks(prev => prev.map(t => (t.id === id ? toTaskDomain(updated) : t)))
    } catch (err) {
      console.error("Failed to update task:", err)
      setError(err.message)
    }
  }

  async function deleteTask(id) {
    const task = tasks.find(t => t.id === id)

    try {
      await tasksApi.remove(id)
      setTasks(prev => prev.filter(t => t.id !== id))

      if (task) logIntent({ type: "TASK_DELETED", taskId: id, title: task.title })
    } catch (err) {
      console.error("Failed to delete task:", err)
      setError(err.message)
    }
  }

  return {
    tasks,
    loading,
    error,
    search,
    setSearch,
    addTask,
    toggleTaskStatus,
    updateTask,
    deleteTask
  }
}
