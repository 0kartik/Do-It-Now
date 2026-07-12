import express from "express"
import { body, query, validationResult } from "express-validator"

import Task from "../Models/Task.js"
import { AppError } from "../utils/AppError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { writeLimiter } from "../middleware/rateLimiters.js"

const router = express.Router()

router.use(authMiddleware)

// GET /api/v1/tasks
// Optional query params: status, priority, search, page (default 1), limit (default 20, max 100)
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const filter = { userId: req.userId }
    if (req.query.status) filter.status = req.query.status
    if (req.query.priority) filter.priority = req.query.priority
    if (req.query.search) filter.title = { $regex: req.query.search, $options: "i" }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const skip = (page - 1) * limit

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter)
    ])

    res.json({
      data: tasks,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    })
  })
)

// POST /api/v1/tasks
router.post(
  "/",
  writeLimiter,
  [
    body("title").notEmpty().withMessage("title is required"),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("dueDate").optional().isISO8601()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const task = await Task.create({ ...req.body, userId: req.userId })
    res.status(201).json(task)
  })
)

// PUT /api/v1/tasks/:id
router.put(
  "/:id",
  writeLimiter,
  asyncHandler(async (req, res) => {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!updated) throw new AppError("Task not found", 404)
    res.json(updated)
  })
)

// DELETE /api/v1/tasks/:id
router.delete(
  "/:id",
  writeLimiter,
  asyncHandler(async (req, res) => {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId })

    if (!deleted) throw new AppError("Task not found", 404)
    res.json({ success: true })
  })
)

export default router
