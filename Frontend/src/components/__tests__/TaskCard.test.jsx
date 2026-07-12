import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import TaskCard from "../TaskCard"

describe("TaskCard", () => {
  it("renders title, description, and pending status", () => {
    render(<TaskCard title="Write report" description="Q3 summary" status={false} onToggle={() => {}} onDelete={() => {}} />)
    expect(screen.getByText("Write report")).toBeInTheDocument()
    expect(screen.getByText("Q3 summary")).toBeInTheDocument()
    expect(screen.getByText("○ Pending")).toBeInTheDocument()
  })

  it("shows done status and an overdue label for a past due date on an incomplete task", () => {
    render(
      <TaskCard
        title="Old task"
        description=""
        status={false}
        dueDate="2020-01-01"
        onToggle={() => {}}
        onDelete={() => {}}
      />
    )
    expect(screen.getByText(/Overdue/)).toBeInTheDocument()
  })

  it("calls onToggle exactly once when Done is clicked", () => {
    const onToggle = vi.fn()
    render(<TaskCard title="Task" description="" status={false} onToggle={onToggle} onDelete={() => {}} />)
    fireEvent.click(screen.getByText("Done"))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it("calls onDelete exactly once when Delete is clicked", () => {
    const onDelete = vi.fn()
    render(<TaskCard title="Task" description="" status={false} onToggle={() => {}} onDelete={onDelete} />)
    fireEvent.click(screen.getByText("Delete"))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
