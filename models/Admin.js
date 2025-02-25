// Import Mongoose
const mongoose = require("mongoose");

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: "N/A",
  },
  updateTime: {
    type: String,
    default: "N/A",
  },
});

// Create the Admin model
const Admin = mongoose.model("Admin", adminSchema, "Admin");

// Export the model
module.exports = Admin;
