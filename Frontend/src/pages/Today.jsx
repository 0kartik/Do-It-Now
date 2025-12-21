import { useState, useEffect } from "react"
import { initialTasks } from "../data/tasks"
import TaskCard from "..src/components/Taskcard"

export default function Today() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks")
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    if (!newTask.trim()) return

    const task = {
  id: crypto.randomUUID(),
  title: "Learn React",
  description: "Practice components",
  status: false
}


    setTasks([...tasks, task])
    setNewTask("")
  }

 function deleteTask(id) {
  setTasks(tasks => tasks.filter(task => task.id !== id))
}


  function toggleTaskStatus(id) {
  setTasks(tasks =>
    tasks.map(task =>
      task.id === id
        ? { ...task, status: !task.status }
        : task
    )
  )
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

          {tasks.map(task => (
      <TaskCard
        key={task.id}
        title={task.title}
        description={task.description}
        status={task.status}
        onToggle={() => toggleTaskStatus(task.id)}
        onDelete={() => deleteTask(task.id)}
      />
    ))}

    </>
  )
}