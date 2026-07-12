import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { useTasks } from "../usetasks"

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: true })
}))

vi.mock("../../services/api", () => ({
  tasksApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

vi.mock("../../services/storageServices", () => ({
  logIntent: vi.fn()
}))

import { tasksApi } from "../../services/api"

function mockTask(overrides = {}) {
  return {
    _id: "1",
    title: "Test task",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: null,
    createdAt: Date.now(),
    ...overrides
  }
}

describe("useTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("loads tasks on mount and maps them into domain shape", async () => {
    tasksApi.list.mockResolvedValue({ data: [mockTask()], page: 1, total: 1, totalPages: 1 })

    const { result } = renderHook(() => useTasks())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].status).toBe(false) // "pending" -> boolean false
  })

  it("adds a task and appends it to state", async () => {
    tasksApi.list.mockResolvedValue({ data: [], page: 1, total: 0, totalPages: 1 })
    tasksApi.create.mockResolvedValue(mockTask({ _id: "2", title: "New task" }))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addTask("New task")
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe("New task")
  })

  it("toggles task status from pending to done", async () => {
    tasksApi.list.mockResolvedValue({ data: [mockTask()], page: 1, total: 1, totalPages: 1 })
    tasksApi.update.mockResolvedValue(mockTask({ status: "done" }))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.toggleTaskStatus("1")
    })

    expect(tasksApi.update).toHaveBeenCalledWith("1", { status: "done" })
    expect(result.current.tasks[0].status).toBe(true)
  })

  it("removes a task on delete", async () => {
    tasksApi.list.mockResolvedValue({ data: [mockTask()], page: 1, total: 1, totalPages: 1 })
    tasksApi.remove.mockResolvedValue({ success: true })

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.deleteTask("1")
    })

    expect(result.current.tasks).toHaveLength(0)
  })
})
