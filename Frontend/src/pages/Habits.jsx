import { useState } from "react"
import { useHabitsContext } from "../context/HabitsContext"
import { isCompletedToday } from "../utils/habitLogic"
import { getStreakRisk } from "../utils/riskUtils"

export default function Habits() {
  const { habits, loading, completeHabit, addHabit, deleteHabit } = useHabitsContext()
  const [newHabitTitle, setNewHabitTitle] = useState("")

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
        padding: "20px",
        background: "#f5f5f5",
        borderRadius: "8px"
      }}>
        <h3 style={{ marginTop: 0 }}>Add New Habit</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="e.g., Morning Exercise"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "6px"
            }}
          />
          <button 
            type="submit"
            disabled={!newHabitTitle.trim()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: newHabitTitle.trim() ? "#2563eb" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: newHabitTitle.trim() ? "pointer" : "not-allowed"
            }}
          >
            Add Habit
          </button>
        </div>
      </form>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div style={{
          padding: "40px",
          textAlign: "center",
          background: "#f9fafb",
          borderRadius: "8px",
          color: "#6b7280"
        }}>
          <p style={{ fontSize: "18px", margin: 0 }}>
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
                  border: "1px solid #ddd", 
                  padding: "20px", 
                  marginBottom: "15px",
                  borderRadius: "8px",
                  background: completedToday ? "#f0fdf4" : "white"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px"
                }}>
                  <h3 style={{ margin: 0 }}>{habit.title}</h3>
                  {getRiskBadge(habit)}
                </div>

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
          background: "#f5f5f5", 
          borderRadius: "8px" 
        }}>
          <h3>Statistics</h3>
          <p>Total Habits: {habits.length}</p>
          <p>
            Completed Today: {habits.filter(h => isCompletedToday(h.lastCompletedAt)).length}
          </p>
          <p>
            Active Streaks: {habits.filter(h => h.streak > 0).length}
          </p>
          <p>
            Longest Streak: {Math.max(...habits.map(h => h.streak), 0)} days
          </p>
        </div>
      )}
    </div>
  )
}