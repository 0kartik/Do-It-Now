import { useState, useCallback } from "react"
import { useTasksContext } from "../context/TasksContext"
import TaskCard from "../components/TaskCard"
import TaskInput from "../components/TaskInput"

export default function Today() {
  const {
    tasks,
    search,
    setSearch,
    addTask,
    toggleTaskStatus,
    deleteTask
  } = useTasksContext()

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")

  const handleToggle = useCallback(
    (id) => toggleTaskStatus(id),
    [toggleTaskStatus]
  )

  const handleDelete = useCallback(
    (id) => deleteTask(id),
    [deleteTask]
  )

  function handleAddTask(e) {
    e.preventDefault()
    addTask(newTaskTitle, {
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined
    })
    setNewTaskTitle("")
    setNewTaskPriority("medium")
    setNewTaskDueDate("")
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Today's Tasks</h1>

      <form onSubmit={handleAddTask} style={{ marginBottom: "20px" }}>
        <TaskInput
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          priority={newTaskPriority}
          onPriorityChange={(e) => setNewTaskPriority(e.target.value)}
          dueDate={newTaskDueDate}
          onDueDateChange={(e) => setNewTaskDueDate(e.target.value)}
          onSubmit={handleAddTask}
          disabled={!newTaskTitle.trim()}
        />
      </form>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search tasks..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "15px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          boxSizing: "border-box",
          marginBottom: "20px"
        }}
      />

      <div>
        <h2>Task List ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No tasks yet. Add one to get started!</p>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              dueDate={task.dueDate}
              onToggle={() => handleToggle(task.id)}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>

      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "var(--bg-surface)", borderRadius: "16px", border: "1px solid var(--border-soft)" }}>
        <h3 style={{ color: "var(--text-main)" }}>Stats</h3>
        <p style={{ color: "var(--text-muted)" }}>Total Tasks: {tasks.length}</p>
        <p style={{ color: "var(--text-muted)" }}>Completed: {tasks.filter(t => t.status).length}</p>
        <p style={{ color: "var(--text-muted)" }}>Pending: {tasks.filter(t => !t.status).length}</p>
      </div>
    </div>
  )
}
