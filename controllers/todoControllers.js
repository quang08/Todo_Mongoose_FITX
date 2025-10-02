const mongoose = require("mongoose");
const Todo = require("../models/Todo");
const User = require("../models/User");

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTodo = async (req, res) => {
  try {
    console.log("POST /api/todos body:", req.body);
    const { title } = req.body;
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "title is required" });
    }
    const todo = new Todo({ title });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const updates = {};
    if (typeof req.body.title === "string") updates.title = req.body.title;
    if (typeof req.body.completed === "boolean")
      updates.completed = req.body.completed;

    const updated = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Todo not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/todos?completed=true&keyword=study
exports.getTodos = async (req, res) => {
  try {
    const { completed, keyword } = req.query;
    const filter = {};

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "name email"); 

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/todos/user/:id
exports.getTodosByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const todos = await Todo.find({ userId: id })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Todo with optional userId
exports.createTodo = async (req, res) => {
  try {
    console.log("POST /api/todos body:", req.body);
    const { title, userId } = req.body;

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "title is required" });
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const todo = new Todo({ title, userId });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
