import { useState } from "react"
import { initialTasks } from "../data/tasks"

export default function Today() {
  const [tasks, setTasks] = useState(initialTasks)
    return (
        <>
          <h1> Today </h1>
            
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
    )}