import { useState, useEffect, useCallback } from "react"
import { toHabitDomain } from "../adapters/habitAdapters"
import { habitsApi } from "../services/api"
import { logIntent } from "../services/storageServices"
import { useAuth } from "../context/AuthContext"

export function useHabits() {
  const { isAuthenticated } = useAuth()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  const loadHabits = useCallback(async () => {
    if (!isAuthenticated) {
      setHabits([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      // limit is generous (100) since the UI doesn't paginate habits yet -
      // the backend still supports page/limit if that changes later
      const res = await habitsApi.list({ search, limit: 100 })
      setHabits(res.data.map(toHabitDomain))
    } catch (err) {
      console.error("Failed to load habits:", err)
      setError(err.message)
    }
    setLoading(false)
  }, [isAuthenticated, search])

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  async function completeHabit(id) {
    try {
      const updated = await habitsApi.complete(id)
      setHabits(prev => prev.map(h => (h.id === id ? toHabitDomain(updated) : h)))

      logIntent({ type: "HABIT_COMPLETED", habitId: id, newStreak: updated.streak })
    } catch (err) {
      console.error("Failed to complete habit:", err)
      setError(err.message)
    }
  }

  async function addHabit(title, extra = {}) {
    if (!title || title.trim().length < 3) return

    try {
      const created = await habitsApi.create(title.trim(), extra)
      setHabits(prev => [...prev, toHabitDomain(created)])

      logIntent({ type: "HABIT_CREATED", habitId: created._id, title: created.name })
    } catch (err) {
      console.error("Failed to add habit:", err)
      setError(err.message)
    }
  }

  async function updateHabit(id, changes) {
    try {
      const updated = await habitsApi.update(id, changes)
      setHabits(prev => prev.map(h => (h.id === id ? toHabitDomain(updated) : h)))
    } catch (err) {
      console.error("Failed to update habit:", err)
      setError(err.message)
    }
  }

  async function deleteHabit(id) {
    try {
      await habitsApi.remove(id)
      setHabits(prev => prev.filter(habit => habit.id !== id))

      logIntent({ type: "HABIT_DELETED", habitId: id })
    } catch (err) {
      console.error("Failed to delete habit:", err)
      setError(err.message)
    }
  }

  return {
    habits,
    loading,
    error,
    search,
    setSearch,
    completeHabit,
    addHabit,
    updateHabit,
    deleteHabit
  }
}
