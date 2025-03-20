const express = require("express");
const { registerUser, loginUser,getUsers, getUserById, updateUser, deleteUser } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Fetch all users
router.get("/users", getUsers);

// Fetch a single user by ID
router.get("/users/:id", getUserById);

// Update a user
router.put("/users/:id", updateUser);

// Delete a user
router.delete("/users/:id", deleteUser);

module.exports = router;

