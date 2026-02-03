import express from "express"
const router = express.Router()

let habits = []

router.get("/", (req, res) => {
  res.json(habits)
})

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

export default route