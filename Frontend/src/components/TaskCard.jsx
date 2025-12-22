import "./TaskCard.css"

export default function TaskCard({ title, description, status, onToggle, onDelete }) {
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
          style={{ 
            backgroundColor: status ? "#ff9800" : "#4caf50",
            color: "white",
            border: "none",
            flex: 1
          }}
        >
          {status ? "Mark Incomplete" : "Mark Complete"}
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