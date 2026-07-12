export default function TaskInput({
  value,
  onChange,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
  onSubmit,
  disabled
}) {
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid var(--border-soft)",
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
    fontSize: "1rem"
  }

  const controlStyle = {
    minWidth: "180px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  }

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
      <div style={{ ...controlStyle, flex: 1 }}>
        <label htmlFor="task-input">New Task</label>
        <input
          id="task-input"
          type="text"
          value={value}
          onChange={onChange}
          style={inputStyle}
        />
      </div>

      <div style={controlStyle}>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={onPriorityChange}
          style={inputStyle}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div style={controlStyle}>
        <label htmlFor="task-due-date">Due date</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={onDueDateChange}
          style={inputStyle}
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "var(--accent)",
          color: "var(--button-text)",
          cursor: disabled ? "not-allowed" : "pointer"
        }}
      >
        Add Task
      </button>
    </div>
  )
}
