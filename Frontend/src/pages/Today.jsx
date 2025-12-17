import { useState } from "react"
import { initialTasks } from "../data/tasks"
import TaskCard from "../components/TaskCard"

export default function Today() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState("")

  function addTask() {
    if (!newTask.trim()) return

    const task = {
      title: newTask,
      description: "User added task",
      status: false
    }

    setTasks([...tasks, task])
    setNewTask("")
  }

  return (
    <>
      <h1>Today</h1>

      <input
        type="text"
        placeholder="Enter new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />

      <button onClick={addTask}>Add Task</button>

      {tasks.map((task, index) => (
        <TaskCard
          key={index}
          title={task.title}
          description={task.description}
          status={task.status}
          onToggle={() => toggleStatus(index)}
        />
      ))}
    </>
  )
}