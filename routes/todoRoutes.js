const express = require("express");
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByUser,
} = require("../controllers/todoControllers");

const router = express.Router();

router.get("/", getTodos); // ?completed=true&keyword=study
router.get("/user/:id", getTodosByUser);

router.get("/", getTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
