import TaskCard from "../components/Taskcard"

export default function Today() {
    return (
        <>
            <h1> Today </h1>
            
            <TaskCard
                title="Learn React Basics"
                description="Understanding components, props, states"
            />
            <TaskCard
                title="Do 1 DSA Problem"
                description="Keep consistent"
            />
        </>
    )
}