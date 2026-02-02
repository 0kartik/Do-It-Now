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

export default route