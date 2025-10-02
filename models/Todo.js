const { Schema, model } = require("mongoose");

// Todo schema with validation and sensible defaults.
const todoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    versionKey: false,
  }
);

const Todo = model("Todo", todoSchema);

module.exports = Todo;
