import mongoose from "mongoose"

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date, default: null }
  },
  { timestamps: true }
)

taskSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model("Task", taskSchema)
