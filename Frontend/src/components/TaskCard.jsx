import { memo } from "react"
import "./TaskCard.css"

function TaskCard({ title, description, status, onToggle, onDelete }) {
  console.log("TaskCard render:", title)
  return (
    <div className="task-card">
      <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
      <p style={{ margin: "0 0 12px 0", color: "#666" }}>{description}</p>
      
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