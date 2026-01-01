import { useState, useCallback } from "react"
import { useTasksContext } from "../context/TasksContext"
import TaskCard from "../components/TaskCard"
import TaskInput from "../components/TaskInput"

export default function Today() {
  const {
    tasks,
    addTask,
    toggleTaskStatus,
    deleteTask
  } = useTasksContext()

  const [newTaskTitle, setNewTaskTitle] = useState("")

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
    addTask(newTaskTitle)
    setNewTaskTitle("")
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Today's Tasks</h1>

      <form onSubmit={handleAddTask} style={{ marginBottom: "30px" }}>
        <TaskInput
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onSubmit={handleAddTask}
          disabled={!newTaskTitle.trim()}
        />
      </form>

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
              onToggle={() => handleToggle(task.id)}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>

      <div style={{ marginTop: "30px", padding: "15px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h3>Stats</h3>
        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter(t => t.status).length}</p>
        <p>Pending: {tasks.filter(t => !t.status).length}</p>
      </div>
    </div>
  )
}