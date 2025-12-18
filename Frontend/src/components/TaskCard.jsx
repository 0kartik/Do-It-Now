import { useState } from "react"

export default function TaskCard({ title, description, status, onToggle, onDelete }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "12px",
      marginBottom: "10px",
      borderRadius: "8px"
    }}>
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
