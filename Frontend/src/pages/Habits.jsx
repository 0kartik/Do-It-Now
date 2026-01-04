import { useHabits } from "../hooks/useHabit";
//should reflect on the main page of habit 
const { habits, completeHabit } = useHabits()

  {habits.map(habit => (
  <div key={habit.id}>
    <p>
      {habit.title} — Streak: {habit.streak}
    </p>
    <button onClick={() => completeHabit(habit.id)}>
      Mark Done Today
    </button>
  </div>
))}