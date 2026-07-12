import { memo } from "react"
import "./TaskCard.css"

const PRIORITY_COLORS = { low: "#9ca3af", medium: "#f59e0b", high: "#ef4444" }

function isOverdue(dueDate, status) {
  if (!dueDate || status) return false
  return new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
}

function TaskCard({ title, description, status, priority = "medium", dueDate, onToggle, onDelete }) {
  const overdue = isOverdue(dueDate, status)

  return (
    <div className="task-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
        <span style={{
          padding: "3px 8px",
          borderRadius: "4px",
          fontSize: "11px",
          textTransform: "uppercase",
          color: "white",
          backgroundColor: PRIORITY_COLORS[priority]
        }}>
          {priority}
        </span>
      </div>

      <p style={{ margin: "0 0 12px 0", color: "var(--text-muted)" }}>{description}</p>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "12px" 
      }}>
        <p style={{ margin: 0 }}>
          Status: <strong style={{ color: status ? "#4caf50" : "#ff9800" }}>
            {status ? "✓ Done" : "○ Pending"}
          </strong>
        </p>

        {dueDate && (
          <p style={{ margin: 0, fontSize: "13px", color: overdue ? "#f87171" : "var(--text-muted)" }}>
            {overdue ? "⚠ Overdue: " : "Due "}
            {new Date(dueDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
              onClick={onToggle}
              aria-label={status ? "Mark task as not done" : "Mark task as done"}
            >
              {status ? "Undo" : "Done"}
            </button>


        <button 
          onClick={onDelete}
          style={{ 
            backgroundColor: "#f44336",
            color: "white",
            border: "none"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
export default memo(TaskCard)
