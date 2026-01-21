import { useState, useEffect } from "react"
import { initialHabits } from "../data/habits"
import { updateHabitOnComplete } from "../utils/habitLogic"
import { isNewDay } from "../utils/dateUtils"
import { dayDiff } from "../utils/streakUtils"
import { toHabitDomain, toHabitStorage } from "../adapters/habitAdapters"
import { 
  saveHabits, 
  fetchHabits, 
  logIntent,
  setLastOpenDate,
  getLastOpenDate,
  cleanupStorage
} from "../services/storageService"

export function useHabits() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  // Load habits from storage on mount
  useEffect(() => {
    async function loadHabits() {
      setLoading(true)
      try {
        const rawHabits = await fetchHabits()
        const loadedHabits = rawHabits.length > 0 
          ? rawHabits.map(toHabitDomain)
          : initialHabits.map(toHabitDomain)
        
        setHabits(loadedHabits)
        
        await logIntent({
          type: "HABITS_LOADED",
          count: loadedHabits.length
        })
      } catch (error) {
        console.error("Failed to load habits:", error)
        setHabits(initialHabits.map(toHabitDomain))
      }
      setLoading(false)
    }
    
    loadHabits()
    
    // Cleanup storage on mount
    cleanupStorage()
  }, [])

  // Save habits to storage whenever they change
  useEffect(() => {
    if (!loading && habits.length > 0) {
      const storageHabits = habits.map(toHabitStorage)
      saveHabits(storageHabits)
    }
  }, [habits, loading])

  // Check for new day and update streaks
  useEffect(() => {
    const lastOpen = getLastOpenDate()

    if (isNewDay(lastOpen)) {
      console.log("New day detected - checking streaks...")
      
      logIntent({
        type: "NEW_DAY_DETECTED",
        lastOpen,
        now: Date.now()
      })
      
      // Update habits based on day gaps
      setHabits(prev => 
        prev.map(habit => {
          if (!habit.lastCompletedAt) return habit

          const gap = dayDiff(habit.lastCompletedAt)

          // Completed today or yesterday - no change
          if (gap <= 1) return habit

          // Missed 1 day - use grace period
          if (gap === 2 && !habit.graceUsed) {
            logIntent({
              type: "GRACE_PERIOD_USED",
              habitId: habit.id,
              habitTitle: habit.title
            })
            return { ...habit, graceUsed: true }
          }

          // Missed more than grace period - reset streak
          if (gap > 2 || (gap === 2 && habit.graceUsed)) {
            logIntent({
              type: "STREAK_BROKEN",
              habitId: habit.id,
              habitTitle: habit.title,
              streakLost: habit.streak
            })
            return { 
              ...habit, 
              streak: 0, 
              graceUsed: false 
            }
          }

          return habit
        })
      )
    }

    setLastOpenDate()
  }, [])

  async function completeHabit(id) {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id === id) {
          const updated = updateHabitOnComplete(habit)
          
          // Log the completion
          logIntent({
            type: "HABIT_COMPLETED",
            habitId: id,
            habitTitle: habit.title,
            newStreak: updated.streak,
            graceUsed: updated.graceUsed
          })
          
          return updated
        }
        return habit
      })
    )
  }

  async function addHabit(title) {
    if (!title || title.trim().length < 3) return

    const newHabit = {
      id: crypto.randomUUID(),
      title: title.trim(),
      frequency: "daily",
      streak: 0,
      lastCompletedAt: null,
      graceUsed: false,
      completionHistory: [],
      createdAt: Date.now()
    }

    await logIntent({
      type: "HABIT_CREATED",
      habitId: newHabit.id,
      title: newHabit.title
    })

    setHabits(prev => [...prev, toHabitDomain(newHabit)])
  }

  async function deleteHabit(id) {
    const habit = habits.find(h => h.id === id)
    
    if (habit) {
      await logIntent({
        type: "HABIT_DELETED",
        habitId: id,
        habitTitle: habit.title,
        streakLost: habit.streak
      })
    }
    
    setHabits(prev => prev.filter(habit => habit.id !== id))
  }

  return {
    habits,
    loading,
    completeHabit,
    addHabit,
    deleteHabit
  }
}