const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Pending", "In-Progress", "Completed"], default: "Pending" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Task", taskSchema);
