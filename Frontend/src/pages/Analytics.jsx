// src/pages/Analytics.jsx
import { useState, useEffect } from "react"
import { getIntentLogs, replayIntents} from "../services/storageServices"
import { compareTrends } from "../utils/trendUtils"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"

export default function Analytics() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    habitsCompleted: 0,
    tasksCompleted: 0,
    habitsCreated: 0,
    tasksCreated: 0,
    streaksBroken: 0,
    gracesUsed: 0
  })

  useEffect(() => {
    const intentLogs = getIntentLogs()
    setLogs(intentLogs)

    // Calculate stats from logs
    const calculatedStats = {
      totalEvents: intentLogs.length,
      habitsCompleted: intentLogs.filter(l => l.type === "HABIT_COMPLETED").length,
      tasksCompleted: intentLogs.filter(l => l.type === "TASK_COMPLETED").length,
      habitsCreated: intentLogs.filter(l => l.type === "HABIT_CREATED").length,
      tasksCreated: intentLogs.filter(l => l.type === "TASK_CREATED").length,
      streaksBroken: intentLogs.filter(l => l.type === "STREAK_BROKEN").length,
      gracesUsed: intentLogs.filter(l => l.type === "GRACE_PERIOD_USED").length
    }

    setStats(calculatedStats)
  }, [])

  const trend = compareTrends(logs, "HABIT_COMPLETED")
  const dailySeries = buildDailySeries(logs, 14)

  function buildDailySeries(allLogs, days) {
    const dayMs = 24 * 60 * 60 * 1000
    const buckets = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * dayMs)
      const key = date.toISOString().slice(0, 10)
      buckets.push({ key, label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), habits: 0, tasks: 0 })
    }

    const byKey = Object.fromEntries(buckets.map(b => [b.key, b]))

    allLogs.forEach(log => {
      const key = new Date(log.timestamp).toISOString().slice(0, 10)
      const bucket = byKey[key]
      if (!bucket) return
      if (log.type === "HABIT_COMPLETED") bucket.habits += 1
      if (log.type === "TASK_COMPLETED") bucket.tasks += 1
    })

    return buckets
  }


  

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString()
  }

  function getEventColor(type) {
    const colors = {
      HABIT_COMPLETED: "#4caf50",
      TASK_COMPLETED: "#2196f3",
      HABIT_CREATED: "#9c27b0",
      TASK_CREATED: "#ff9800",
      STREAK_BROKEN: "#f44336",
      GRACE_PERIOD_USED: "#ff5722",
      NEW_DAY_DETECTED: "#607d8b"
    }
    return colors[type] || "#9e9e9e"
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", color: "var(--text-main)" }}>
      <h1>📊 Analytics Dashboard</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Track your activity using event sourcing logs
      </p>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginTop: "30px",
        marginBottom: "40px"
      }}>
        <StatCard title="Total Events" value={stats.totalEvents} color="#2196f3" />
        <StatCard title="Habits Completed" value={stats.habitsCompleted} color="#4caf50" />
        <StatCard title="Tasks Completed" value={stats.tasksCompleted} color="#00bcd4" />
        <StatCard title="Habits Created" value={stats.habitsCreated} color="#9c27b0" />
        <StatCard title="Tasks Created" value={stats.tasksCreated} color="#ff9800" />
        <StatCard title="Streaks Broken" value={stats.streaksBroken} color="#f44336" />
        <StatCard title="Graces Used" value={stats.gracesUsed} color="#ff5722" />
      </div>

      {/* Trend + Chart */}
      <div style={{
        backgroundColor: "var(--bg-surface)",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid var(--border-soft)",
        marginBottom: "30px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, color: "var(--text-main)" }}>Last 14 Days</h2>
          <span style={{
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "13px",
            color: "white",
            backgroundColor: trend === "improving" ? "#22c55e" : trend === "declining" ? "#ef4444" : "#6b7280"
          }}>
            {trend === "improving" ? "📈 Improving" : trend === "declining" ? "📉 Declining" : "➖ Stable"}
          </span>
        </div>

        {logs.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
            No activity yet - complete a habit or task to see your trend here.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailySeries} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="habits" name="Habits completed" stroke="#4caf50" strokeWidth={2} />
              <Line type="monotone" dataKey="tasks" name="Tasks completed" stroke="#2196f3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Event Timeline */}
      <div style={{
        backgroundColor: "var(--bg-surface)",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid var(--border-soft)"
      }}>
        <h2 style={{ color: "var(--text-main)" }}>Event Timeline</h2>
        
        {logs.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
            No events logged yet. Start using the app to see your activity!
          </p>
        ) : (
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {logs.slice().reverse().map((log, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "var(--bg-surface)",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "12px",
                  borderLeft: `4px solid ${getEventColor(log.type)}`,
                  boxShadow: "var(--shadow-card)"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <strong style={{ color: getEventColor(log.type) }}>
                      {log.type.replace(/_/g, " ")}
                    </strong>
                    
                    {log.habitTitle && (
                      <span style={{ marginLeft: "10px", color: "var(--text-muted)" }}>
                        - {log.habitTitle}
                      </span>
                    )}
                    
                    {log.title && (
                      <span style={{ marginLeft: "10px", color: "var(--text-muted)" }}>
                        - {log.title}
                      </span>
                    )}
                    
                    {log.newStreak !== undefined && (
                      <span style={{ marginLeft: "10px", color: "#4caf50" }}>
                        (Streak: {log.newStreak})
                      </span>
                    )}
                    
                    {log.streakLost !== undefined && (
                      <span style={{ marginLeft: "10px", color: "#f44336" }}>
                        (Lost: {log.streakLost} days)
                      </span>
                    )}
                  </div>
                  
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {formatDate(log.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Replay State Section */}
      {logs.length > 0 && (
        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "rgba(255, 243, 205, 0.18)",
          borderRadius: "12px",
          border: "1px solid #ffc107",
          color: "var(--text-main)"
        }}>
          <h3 style={{ color: "var(--text-main)" }}>🔄 Event Sourcing</h3>
          <p style={{ margin: "10px 0", color: "var(--text-muted)" }}>
            Your app uses event sourcing to track all actions. This means we can 
            replay events to reconstruct your app state at any point in time.
          </p>
          <button
            onClick={() => {
              const state = replayIntents(logs)
              console.log("Replayed state:", state)
              alert("Check console for replayed state!")
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Replay Events (Check Console)
          </button>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      border: `2px solid ${color}`,
      textAlign: "center"
    }}>
      <h4 style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}>
        {title}
      </h4>
      <p style={{
        margin: 0,
        fontSize: "32px",
        fontWeight: "bold",
        color: color
      }}>
        {value}
      </p>
    </div>
  )
}