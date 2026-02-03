import mongoose from "mongoose"

const habitSchema = new mongoose.Schema({
  name: String,
  effort: { type: Number, default: 1 },
  priority: { type: Number, default: 2 },
  goal: {
    target: { type: Number, default: 1 },
    period: { type: String, default: "day" }
  }
})

export default mongoose.model("Habit", habitSchema)