const STORAGE_KEYS = {
  HABITS: "habits",
  TASKS: "consistency_tasks",
  INTENT_LOG: "intent_logs",
  LAST_OPEN: "last_open_date",
  APP_VERSION: "app_version"
}

// Time utilities
export function now() {
  return Date.now()
}

export function today() {
  const d = new Date(now())
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// Intent Logging for Event Sourcing
export async function logIntent(event) {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTENT_LOG)) || []
    logs.push({
      ...event,
      timestamp: now()
    })
    
    // Keep only last 1000 events to prevent storage overflow
    const recentLogs = logs.slice(-1000)
    
    localStorage.setItem(STORAGE_KEYS.INTENT_LOG, JSON.stringify(recentLogs))
    return true
  } catch (error) {
    console.error("Failed to log intent:", error)
    return false
  }
}

// Replay Utils - Reconstruct state from intent logs
export function replayIntents(intents) {
  return intents.reduce((state, event) => {
    switch (event.type) {
      case "HABIT_COMPLETED":
        state.habits[event.habitId] = {
          ...(state.habits[event.habitId] || {}),
          completions: (state.habits[event.habitId]?.completions || 0) + 1,
          lastCompleted: event.timestamp
        }
        break
      
      case "HABIT_CREATED":
        state.habits[event.habitId] = {
          id: event.habitId,
          title: event.title,
          createdAt: event.timestamp,
          completions: 0
        }
        break
      
      case "HABIT_DELETED":
        delete state.habits[event.habitId]
        break
      
      case "TASK_COMPLETED":
        state.tasks[event.taskId] = {
          ...(state.tasks[event.taskId] || {}),
          completed: true,
          completedAt: event.timestamp
        }
        break
      
      case "TASK_CREATED":
        state.tasks[event.taskId] = {
          id: event.taskId,
          title: event.title,
          createdAt: event.timestamp,
          completed: false
        }
        break
      
      default:
        break
    }
    return state
  }, { habits: {}, tasks: {} })
}

// Get all intent logs
export function getIntentLogs() {
  try {
    const logs = localStorage.getItem(STORAGE_KEYS.INTENT_LOG)
    return logs ? JSON.parse(logs) : []
  } catch (error) {
    console.error("Failed to get intent logs:", error)
    return []
  }
}

// Storage with timestamp wrapper
function setItemWithTimestamp(key, value) {
  try {
    const entry = {
      data: value,
      timestamp: now(),
      version: "1.0.0"
    }
    localStorage.setItem(key, JSON.stringify(entry))
    return true
  } catch (error) {
    console.error(`Failed to save ${key}:`, error)
    return false
  }
}

function getItemWithTimestamp(key) {
  try {
    const entryStr = localStorage.getItem(key)
    if (!entryStr) return null
    
    const entry = JSON.parse(entryStr)
    
    // Check if data has timestamp wrapper (new format)
    if (entry && entry.data !== undefined) {
      return entry.data
    }
    
    // Legacy format without timestamp wrapper
    return entry
  } catch (error) {
    console.error(`Failed to load ${key}:`, error)
    return null
  }
}

// Habits Storage
export async function saveHabits(habits) {
  try {
    const success = setItemWithTimestamp(STORAGE_KEYS.HABITS, habits)
    if (success) {
      await logIntent({
        type: "HABITS_SAVED",
        count: habits.length
      })
    }
    return success
  } catch (error) {
    console.error("Failed to save habits:", error)
    return false
  }
}

export async function fetchHabits() {
  try {
    const data = getItemWithTimestamp(STORAGE_KEYS.HABITS)
    if (!data || !Array.isArray(data)) {
      return []
    }
    return data
  } catch (error) {
    console.error("Failed to fetch habits:", error)
    return []
  }
}

// Tasks Storage
export async function saveTasks(tasks) {
  try {
    const success = setItemWithTimestamp(STORAGE_KEYS.TASKS, tasks)
    if (success) {
      await logIntent({
        type: "TASKS_SAVED",
        count: tasks.length
      })
    }
    return success
  } catch (error) {
    console.error("Failed to save tasks:", error)
    return false
  }
}

export async function fetchTasks() {
  try {
    const data = getItemWithTimestamp(STORAGE_KEYS.TASKS)
    if (!data || !Array.isArray(data)) {
      return []
    }
    return data
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return []
  }
}

// Last Open Date
export function setLastOpenDate(timestamp = now()) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_OPEN, timestamp.toString())
    return true
  } catch (error) {
    console.error("Failed to set last open date:", error)
    return false
  }
}

export function getLastOpenDate() {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_OPEN)
    return timestamp ? parseInt(timestamp, 10) : null
  } catch (error) {
    console.error("Failed to get last open date:", error)
    return null
  }
}

// Storage cleanup - remove old entries if storage is getting full
export function cleanupStorage() {
  try {
    // Check storage size (approximate)
    let totalSize = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length
      }
    }
    
    const maxSize = 5 * 1024 * 1024 // 5MB (typical limit)
    const usagePercentage = (totalSize / maxSize) * 100
    
    console.log(`Storage usage: ${usagePercentage.toFixed(2)}%`)
    
    // If using more than 80% of storage, clean up old intent logs
    if (usagePercentage > 80) {
      const logs = getIntentLogs()
      const recentLogs = logs.slice(-500) // Keep only last 500
      localStorage.setItem(STORAGE_KEYS.INTENT_LOG, JSON.stringify(recentLogs))
      console.log("Storage cleaned up - removed old intent logs")
    }
    
    return true
  } catch (error) {
    console.error("Failed to cleanup storage:", error)
    return false
  }
}

// Clear all app data (useful for reset)
export function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error("Failed to clear all data:", error)
    return false
  }
}

// Export storage keys for use in components
export { STORAGE_KEYS }