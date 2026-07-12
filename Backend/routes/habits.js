import express from "express"
import { body, query, validationResult } from "express-validator"

import Habit from "../Models/Habit.js"
import { AppError } from "../utils/AppError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { writeLimiter } from "../middleware/rateLimiters.js"
import { getCache, setCache, clearCache } from "../utils/cache.js"

const router = express.Router()

router.use(authMiddleware)

function habitListCacheKey(userId, query) {
  return `habits:${userId}:${JSON.stringify(query)}`
}

// GET /api/v1/habits
// Optional query params: priority, search, page (default 1), limit (default 20, max 100)
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const cacheKey = habitListCacheKey(req.userId, req.query)
    const cached = getCache(cacheKey)
    if (cached) return res.json(cached)

    const filter = { userId: req.userId }
    if (req.query.priority) filter.priority = req.query.priority
    if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const skip = (page - 1) * limit

    const [habits, total] = await Promise.all([
      Habit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Habit.countDocuments(filter)
    ])

    const payload = {
      data: habits,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }

    setCache(cacheKey, payload)
    res.json(payload)
  })
)

// POST /api/v1/habits
router.post(
  "/",
  writeLimiter,
  [
    body("name").notEmpty().withMessage("name is required"),
    body("frequency").optional().isIn(["daily", "weekly"]),
    body("effort").optional().isInt({ min: 1, max: 3 }),
    body("priority").optional().isInt({ min: 1, max: 3 }),
    body("goal.target").optional().isInt({ min: 1 }),
    body("goal.period").optional().isIn(["day", "week"])
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const habit = await Habit.create({ ...req.body, userId: req.userId })
    clearCache()
    res.status(201).json(habit)
  })
)

// PUT /api/v1/habits/:id
router.put(
  "/:id",
  writeLimiter,
  asyncHandler(async (req, res) => {
    const updated = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!updated) throw new AppError("Habit not found", 404)

    clearCache()
    res.json(updated)
  })
)

// DELETE /api/v1/habits/:id
router.delete(
  "/:id",
  writeLimiter,
  asyncHandler(async (req, res) => {
    const deleted = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId })

    if (!deleted) throw new AppError("Habit not found", 404)

    clearCache()
    res.json({ success: true })
  })
)

// PATCH /api/v1/habits/:id/complete
// Mirrors the app's streak rules (one "grace day" is allowed per miss):
//   - same calendar day as lastCompleted -> no-op (already logged today)
//   - exactly 1 day since lastCompleted  -> streak continues (+1), grace reset
//   - exactly 2 days since lastCompleted AND grace not yet used -> streak
//     still continues (+1), grace is consumed for next time
//   - any longer gap, or a 2nd day already used the grace -> streak resets to 1
router.patch(
  "/:id/complete",
  writeLimiter,
  asyncHandler(async (req, res) => {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId })
    if (!habit) throw new AppError("Habit not found", 404)

    const now = new Date()

    if (habit.lastCompleted) {
      const dayMs = 24 * 60 * 60 * 1000
      const lastDay = Math.floor(habit.lastCompleted.getTime() / dayMs)
      const today = Math.floor(now.getTime() / dayMs)
      const gap = today - lastDay

      if (gap === 0) {
        clearCache()
        return res.json(habit)
      } else if (gap === 1) {
        habit.streak += 1
        habit.graceUsed = false
      } else if (gap === 2 && !habit.graceUsed) {
        habit.streak += 1
        habit.graceUsed = true
      } else {
        habit.streak = 1
        habit.graceUsed = false
      }
    } else {
      habit.streak = 1
      habit.graceUsed = false
    }

    habit.lastCompleted = now
    await habit.save()

    clearCache()
    res.json(habit)
  })
)

export default router
