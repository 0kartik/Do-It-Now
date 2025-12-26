import { useTasks } from "../hooks/useTasks"

    const { tasks } = useTasks()
    const total = tasks.length
    const completed = tasks.filter(t => t.status).length
    const pending = total - completed
export default function Stats() {
    <h2>Stats</h2>
    <p>Total Tasks: {total}</p>
    <p>Completed: {completed}</p>
    <p>Pending: {pending}</p>
    {total === 0 && <p>No data to show yet.</p>}

}