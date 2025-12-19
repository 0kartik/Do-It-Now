import { useState } from "react"
import "./TaskCard.css"
export default function TaskCard({ title, description, status, onToggle, onDelete }) {
  return (
    <div className="task-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Status: {status ? "Done" : "Not Done"}</p>

      <button onClick={onToggle}>
        {status ? "Undo" : "Mark as Done"}
      </button>

      <button onClick={onDelete} style={{ marginLeft: "10px" }}>
        Delete
      </button>
    </div>
  )
}
