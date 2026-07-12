import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import TaskInput from "../TaskInput"

// Regression test: the "Add Task" button used to have no explicit `type`,
// which defaults to type="submit" inside a <form> - clicking it fired both
// the button's onClick AND the form's onSubmit, adding every task twice.
describe("TaskInput", () => {
  it("calls onSubmit exactly once per click, even inside a form", () => {
    const onSubmit = vi.fn(e => e?.preventDefault?.())

    render(
      <form onSubmit={onSubmit}>
        <TaskInput
          value="Buy milk"
          onChange={() => {}}
          priority="medium"
          onPriorityChange={() => {}}
          dueDate=""
          onDueDateChange={() => {}}
          onSubmit={onSubmit}
          disabled={false}
        />
      </form>
    )

    fireEvent.click(screen.getByText("Add Task"))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it("disables the Add Task button when disabled prop is true", () => {
    render(
      <TaskInput
        value=""
        onChange={() => {}}
        priority="medium"
        onPriorityChange={() => {}}
        dueDate=""
        onDueDateChange={() => {}}
        onSubmit={() => {}}
        disabled={true}
      />
    )
    expect(screen.getByText("Add Task")).toBeDisabled()
  })
})
