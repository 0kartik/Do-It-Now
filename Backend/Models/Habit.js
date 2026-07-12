import mongoose from "mongoose"

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    effort: { type: Number, min: 1, max: 3, default: 1 },
    priority: { type: Number, min: 1, max: 3, default: 2 },
    goal: {
      target: { type: Number, default: 1 },
      period: { type: String, default: "day" }
    },
    streak: { type: Number, default: 0 },
    graceUsed: { type: Boolean, default: false },
    lastCompleted: { type: Date, default: null }
  },
  { timestamps: true }
)

habitSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model("Habit", habitSchema)
