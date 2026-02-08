import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../Models/User.js"
import { body, validationResult } from "express-validator"


router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  })
router.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10)

  const user = await User.create({
    ...req.body,
    password: hashed
  })

  res.json(user)
})

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) return res.status(400).json({ msg: "User not found" })

  const ok = await bcrypt.compare(req.body.password, user.password)

  if (!ok) return res.status(400).json({ msg: "Wrong password" })

  const token = jwt.sign({ id: user._id }, "secretkey")

  res.json({ token })
})

export default router