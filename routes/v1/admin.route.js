// routes/admin.routes.js
const express = require("express");
const app = express.Router();
const adminController = require("../../controllers/admin.controller");
const { auth } = require("../../middleware/auth");

// Protected Routes
app.post("/create", adminController.createAdmin);
app.post("/login", adminController.adminLogin);
app.post("/change-password", auth, adminController.adminLogin);
app.post("/refresh-token", adminController.refreshAccessToken);
app.get("/", auth, adminController.getAdmin);
app.put("/:adminId", auth, adminController.updatedAdmin);

module.exports = app;
