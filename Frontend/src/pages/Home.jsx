import { useTasksContext } from '../context/TasksContext'
import { useHabitsContext } from '../context/HabitsContext'
import { Link } from 'react-router-dom'
import { isCompletedToday } from '../utils/habitLogic'
import { getIntentLogs } from '../services/storageServices'
import { compareTrends } from '../utils/trendUtils'
import { getNudges } from '../utils/nudgeUtils'

export default function Home() {
  const { tasks, toggleTaskStatus } = useTasksContext()
  const { habits } = useHabitsContext()

  const pendingTasks = tasks.filter((t) => !t.status)
  const completedTasks = tasks.filter((t) => t.status)
  const habitsCompletedToday = habits.filter((h) => isCompletedToday(h.lastCompletedAt)).length

  const intents = getIntentLogs()
  const trend = compareTrends(intents, 'HABIT_COMPLETED')
  const nudges = getNudges({ habits, intents, trend })
  const criticalPending = pendingTasks.length > 0

  return (
    <div className="home-page">
      <section className="stats-grid">
        <article className="stat-card stat-card--tasks">
          <div className="stat-card__label">Task completion</div>
          <div className="stat-card__value">{completedTasks.length}/{tasks.length}</div>
        </article>

        <article className="stat-card stat-card--habits">
          <div className="stat-card__label">Habits completed</div>
          <div className="stat-card__value">{habitsCompletedToday}/{habits.length}</div>
        </article>

        <article className="stat-card stat-card--streaks">
          <div className="stat-card__label">Active streaks</div>
          <div className="stat-card__value">{habits.filter((h) => h.streak > 0).length}</div>
        </article>
      </section>

      <section className="content-grid">
        <div className="panel panel--main">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Today&apos;s focus</p>
              <h3>Keep momentum visible</h3>
            </div>
          </div>

          <div className="panel__body">
            {criticalPending && (
              <div className="notice-card">
                ⚠️ You still have {pendingTasks.length} item{pendingTasks.length !== 1 ? 's' : ''} requiring attention.
              </div>
            )}

            {nudges.length > 0 && (
              <div className="nudge-list">
                {nudges.map((nudge, i) => (
                  <div key={i} className="nudge-item">💡 {nudge}</div>
                ))}
              </div>
            )}

            <div className="task-list" role="list">
              {pendingTasks.length > 0 ? pendingTasks.slice(0, 6).map((task) => (
                <button key={task.id} type="button" className="task-item" onClick={() => toggleTaskStatus(task.id)}>
                  <span className="task-item__checkbox" aria-hidden="true" />
                  <span className="task-item__content">
                    <span className="task-item__title">{task.title}</span>
                    <span className="task-item__meta">{task.priority || 'Normal'} priority</span>
                  </span>
                </button>
              )) : (
                <div className="empty-state">You are all caught up for now.</div>
              )}
            </div>
          </div>
        </div>

        <aside className="panel panel--accent">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Quick actions</p>
              <h3>Move forward with intent</h3>
            </div>
          </div>

          <div className="panel__body">
            <div className="action-stack">
              <Link to="/today" className="action-link action-link--primary">
                Open today&apos;s plan
              </Link>
              <Link to="/habits" className="action-link action-link--secondary">
                Review habits
              </Link>
            </div>

            <div className="motivation-card">
              <p className="quote-text">
                “Momentum is built by making the next right move visible.”
              </p>
              <div className="mini-pill">Built for steady progress</div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}