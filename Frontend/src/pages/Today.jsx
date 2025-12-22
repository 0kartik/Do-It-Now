import { useState } from "react"
import { useTasks } from "../hooks/usetasks"
import TaskCard from "../components/TaskCard"

export default function Today() {
  const {
    tasks,
    addTask,
    toggleTaskStatus,
    deleteTask
  } = useTasks()

  const [newTaskTitle, setNewTaskTitle] = useState("")

  function handleAddTask(e) {
    e.preventDefault()
    addTask(newTaskTitle)
    setNewTaskTitle("")
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Today's Tasks</h1>

      <form onSubmit={handleAddTask} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
          style={{ 
            padding: "10px", 
            marginRight: "10px",
            fontSize: "16px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <button type="submit">Add Task</button>
      </form>

      <div>
        <h2>Task List ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p style={{ color: "#888" }}>No tasks yet. Add one to get started!</p>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              onToggle={() => toggleTaskStatus(task.id)}
              onDelete={() => deleteTask(task.id)}
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