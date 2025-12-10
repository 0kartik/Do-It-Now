import TaskCard from "../components/Taskcard"
const tasks = [
  {
    title: "Learn React State",
    description: "Understand useState and component reactivity"
  },
  {
    title: "Solve 1 DSA Problem",
    description: "Build consistency for placements"
  },
  {
    title: "Work on Consistency App",
    description: "Daily small progress + commit"
  }
]
export default function Today() {
    return (
        <>
            <h1> Today </h1>
            
            {tasks.map((task, index) => (
                    <TaskCard 
                        key={index}
                        title={task.title}
                        description={task.description}
                    />
            ))}

        </>
    )
}