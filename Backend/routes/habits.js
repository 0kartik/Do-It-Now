import express from "express"
const router = express.Router()

let habits = []

router.post(
  "/",
  [
    body("name").notEmpty(),
    body("effort").optional().isInt({ min: 1, max: 3 }),
    body("priority").optional().isInt({ min: 1, max: 3 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

  }
)
router.get("/", (req, res) => {
  res.json(habits)
})
import { authMiddleware } from "../middleware/authMiddleware.js"

router.use(authMiddleware)

router.post("/", (req, res) => {
  habits.push(req.body)
  res.json(req.body)
})

import Habit from "../Models/Habit.js"

router.get("/", async (req, res) => {
  const habits = await Habit.find()
  res.json(habits)
})

router.post("/", async (req, res) => {
  const habit = await Habit.create(req.body)
  res.json(habit)
})

// UPDATE habit
router.put("/:id", async (req, res) => {
  const updated = await Habit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(updated)
})

// DELETE habit
router.delete("/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})


export default route