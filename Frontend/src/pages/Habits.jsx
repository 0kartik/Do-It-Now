import { useState } from "react"
import { useHabitsContext } from "../context/HabitsContext"
import { isCompletedToday } from "../utils/habitLogic"
import { getStreakRisk } from "../utils/riskUtils"
import { isWeekSuccessful } from "../utils/weeklySuccessUtils"
import { getGoalProgress } from "../utils/goalUtils"
import { getIntentLogs } from "../services/storageServices"

export default function Habits() {
  const { habits, loading, search, setSearch, completeHabit, addHabit, updateHabit, deleteHabit } = useHabitsContext()
  const [newHabitTitle, setNewHabitTitle] = useState("")
  const intents = getIntentLogs()

  function handleComplete(id) {
    const habit = habits.find(h => h.id === id)
    
    if (habit && isCompletedToday(habit.lastCompletedAt)) {
      alert("You already completed this habit today!")
      return
    }

    const confirmed = window.confirm("Did you actually complete this habit today?")
    if (!confirmed) return
    
    completeHabit(id)
  }

  function handleAddHabit(e) {
    e.preventDefault()
    if (!newHabitTitle.trim()) return
    
    addHabit(newHabitTitle)
    setNewHabitTitle("")
  }

  function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this habit?")
    if (!confirmed) return
    
    deleteHabit(id)
  }

  function getRiskBadge(habit) {
    const risk = getStreakRisk(habit)
    const colors = {
      none: "#4caf50",
      warning: "#ff9800",
      critical: "#f44336",
      broken: "#9e9e9e"
    }
    
    return (
      <span style={{
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        backgroundColor: colors[risk] || colors.none,
        color: "white",
        marginLeft: "10px"
      }}>
        {risk === "none" ? "✓ On Track" : 
         risk === "warning" ? "⚠ Warning" :
         risk === "critical" ? "🔥 Critical" :
         "💔 Broken"}
      </span>
    )
  }

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading habits...</div>
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>My Habits</h2>

      {/* Add Habit Form */}
      <form onSubmit={handleAddHabit} style={{ 
        marginBottom: "30px",
        padding: "22px",
        backgroundColor: "var(--bg-surface)",
        borderRadius: "16px",
        border: "1px solid var(--border-soft)"
      }}>
        <h3 style={{ marginTop: 0, color: "var(--text-main)" }}>Add New Habit</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="e.g., Morning Exercise"
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "16px",
              border: "1px solid var(--border-soft)",
              borderRadius: "10px",
              backgroundColor: "var(--bg-page)",
              color: "var(--text-main)"
            }}
          />
          <button 
            type="submit"
            disabled={!newHabitTitle.trim()}
            style={{
              padding: "12px 22px",
              fontSize: "16px",
              backgroundColor: newHabitTitle.trim() ? "#2563eb" : "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: newHabitTitle.trim() ? "pointer" : "not-allowed"
            }}
          >
            Add Habit
          </button>
        </div>
      </form>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search habits..."
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "15px",
            border: "1px solid var(--border-soft)",
            borderRadius: "10px",
            boxSizing: "border-box",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-main)"
          }}
        />
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div style={{
          padding: "40px",
          textAlign: "center",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "12px",
          color: "var(--text-muted)"
        }}>
          <p style={{ fontSize: "18px", margin: 0, color: "var(--text-main)" }}>
            No habits yet. Add your first habit above to get started! 🚀
          </p>
        </div>
      ) : (
        <div>
          <h3>Your Habits ({habits.length})</h3>
          {habits.map(habit => {
            const completedToday = isCompletedToday(habit.lastCompletedAt)
            
            return (
              <div 
                key={habit.id} 
                style={{ 
                  border: "1px solid var(--border-soft)", 
                  padding: "20px", 
                  marginBottom: "15px",
                  borderRadius: "16px",
                  backgroundColor: completedToday ? "var(--bg-muted)" : "var(--bg-surface)"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px"
                }}>
                  <h3 style={{ margin: 0, color: "var(--text-main)" }}>{habit.title}</h3>
                  <div>
                    {getRiskBadge(habit)}
                    {isWeekSuccessful(habit.id, intents) && (
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        backgroundColor: "#7c3aed",
                        color: "white",
                        marginLeft: "6px"
                      }}>
                        🏆 Week goal met
                      </span>
                    )}
                  </div>
                </div>

                {(() => {
                  const progress = getGoalProgress(habit, intents)
                  return (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>
                        <span>
                          Goal: {progress.done}/{progress.target} per {habit.goal.period}
                        </span>
                        <span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = window.prompt("Set target completions per " + habit.goal.period, habit.goal.target)
                              const parsed = parseInt(next, 10)
                              if (Number.isInteger(parsed) && parsed > 0) {
                                updateHabit(habit.id, { goal: { ...habit.goal, target: parsed } })
                              }
                            }}
                            style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13px" }}
                          >
                            Edit goal
                          </button>
                        </span>
                      </div>
                      <div style={{ backgroundColor: "var(--border-soft)", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                        <div style={{
                          background: progress.percent >= 100 ? "#22c55e" : "#3b82f6",
                          width: `${progress.percent}%`,
                          height: "100%"
                        }} />
                      </div>
                    </div>
                  )
                })()}

                <div style={{ marginBottom: "15px" }}>
                  <p style={{ margin: "5px 0" }}>
                    🔥 Streak: <strong style={{ 
                      fontSize: "18px",
                      color: habit.streak > 0 ? "#4caf50" : "#999"
                    }}>
                      {habit.streak} days
                    </strong>
                  </p>
                  
                  {habit.graceUsed && (
                    <p style={{ 
                      margin: "5px 0",
                      color: "#ff9800",
                      fontSize: "14px"
                    }}>
                      ⏰ Grace period used - don't miss today!
                    </p>
                  )}
                  
                  {completedToday && (
                    <p style={{ 
                      margin: "5px 0",
                      color: "#4caf50",
                      fontSize: "14px"
                    }}>
                      ✅ Completed today!
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => handleComplete(habit.id)}
                    disabled={completedToday}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: completedToday ? "#ccc" : "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: completedToday ? "not-allowed" : "pointer"
                    }}
                  >
                    {completedToday ? "✓ Done Today" : "Mark Complete"}
                  </button>

                  <button 
                    onClick={() => handleDelete(habit.id)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats Section */}
      {habits.length > 0 && (
        <div style={{ 
          marginTop: "30px", 
          padding: "20px", 
          backgroundColor: "var(--bg-surface)", 
          borderRadius: "16px",
          border: "1px solid var(--border-soft)"
        }}>
          <h3 style={{ color: "var(--text-main)" }}>Statistics</h3>
          <p style={{ color: "var(--text-muted)" }}>Total Habits: {habits.length}</p>
          <p style={{ color: "var(--text-muted)" }}>
            Completed Today: {habits.filter(h => isCompletedToday(h.lastCompletedAt)).length}
          </p>
          <p style={{ color: "var(--text-muted)" }}>
            Active Streaks: {habits.filter(h => h.streak > 0).length}
          </p>
          <p style={{ color: "var(--text-muted)" }}>
            Longest Streak: {Math.max(...habits.map(h => h.streak), 0)} days
          </p>
        </div>
      )}
    </div>
  )
}