import { useTasksContext } from "../context/TasksContext"
import { useHabitsContext } from "../context/HabitsContext"
import { Link } from "react-router-dom"
import { isCompletedToday } from "../utils/habitLogic"

export default function Home() {
  const { tasks } = useTasksContext()
  const { habits } = useHabitsContext()

  const pendingTasks = tasks.filter(t => !t.status).length
  const completedTasks = tasks.filter(t => t.status).length
  const habitsCompletedToday = habits.filter(h => 
    isCompletedToday(h.lastCompletedAt)
  ).length

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "800px", 
      margin: "0 auto",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "3em", marginBottom: "10px" }}>DO IT NOW</h1>
      <h3 style={{ color: "#666", marginBottom: "40px" }}>
        Your Daily Consistency Tracker
      </h3>

      {/* Quick Stats Dashboard */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div style={{
          padding: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          color: "white"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Today's Tasks</h4>
          <p style={{ fontSize: "2em", margin: 0 }}>
            {completedTasks}/{tasks.length}
          </p>
        </div>

        <div style={{
          padding: "20px",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          borderRadius: "12px",
          color: "white"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Habits Today</h4>
          <p style={{ fontSize: "2em", margin: 0 }}>
            {habitsCompletedToday}/{habits.length}
          </p>
        </div>

        <div style={{
          padding: "20px",
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          borderRadius: "12px",
          color: "white"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Active Streaks</h4>
          <p style={{ fontSize: "2em", margin: 0 }}>
            {habits.filter(h => h.streak > 0).length}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: "#f9fafb",
        padding: "30px",
        borderRadius: "12px",
        marginBottom: "40px"
      }}>
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Link to="/today" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "15px 30px",
              fontSize: "16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              📋 View Today's Tasks
            </button>
          </Link>

          <Link to="/habits" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "15px 30px",
              fontSize: "16px",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              🔥 Track Habits
            </button>
          </Link>
        </div>
      </div>

      {/* Pending Tasks Preview */}
      {pendingTasks > 0 && (
        <div style={{
          background: "#fff3cd",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ffc107"
        }}>
          <p style={{ margin: 0, color: "#856404" }}>
            ⚠️ You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''} today!
          </p>
        </div>
      )}

      {/* Motivational Message */}
      <div style={{
        marginTop: "40px",
        padding: "30px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "12px",
        color: "white"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>💪 Stay Consistent!</h3>
        <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.6" }}>
          "Success is the sum of small efforts repeated day in and day out."
        </p>
      </div>
    </div>
  )
}