const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

// ✅ THIS IS THE FIX (functions must exist)
router.get("/users", auth, admin, getUsers);
router.post("/users", auth, admin, createUser);
router.put("/users/:id", auth, admin, updateUser);
router.delete("/users/:id", auth, admin, deleteUser);

module.exports = router;