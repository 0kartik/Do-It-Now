import { useHabitsContext } from "../context/HabitsContext"

export default function Habits() {
  const { habits, completeHabit } = useHabitsContext()

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Habits</h2>
      {habits.length === 0 ? (
        <p>No habits yet. Add your first habit!</p>
      ) : (
        habits.map(habit => (
          <div key={habit.id} style={{ 
            border: "1px solid #ddd", 
            padding: "15px", 
            marginBottom: "10px",
            borderRadius: "8px"
          }}>
            <p>
              <strong>{habit.title}</strong> — Streak: {habit.streak} days
            </p>
            <button onClick={() => completeHabit(habit.id)}>
              Mark Done Today
            </button>
          </div>
        ))
      )}
    </div>
  )
}