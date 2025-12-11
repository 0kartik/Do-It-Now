import { useState } from "react"

export default function Today() {
  const [tasks, setTasks] = useState([
    {
      title: "Learn React State",
      description: "Understand useState and component reactivity",
      status: false
    },
    {
      title: "Solve 1 DSA Problem",
      description: "Build consistency for placements",
      status: false
    },
    {
      title: "Work on Consistency App",
      description: "Daily small progress + commit",
      status: false
    },
    function toggleStatus(index) {
    const updated = [...tasks]
    updated[index].status = !updated[index].status
    setTasks(updated)
      }
  ])
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