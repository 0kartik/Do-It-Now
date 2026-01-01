export default function TaskInput({
  value,
  onChange,
  onSubmit,
  disabled
}) {
  return (
    <div>
      <label htmlFor="task-input">New Task</label>
      <input
        id="task-input"
        type="text"
        value={value}
        onChange={onChange}
      />
      <button onClick={onSubmit} disabled={disabled}>
        Add Task
      </button>
    </div>
  )
}