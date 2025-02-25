// Import Mongoose
const mongoose = require("mongoose");

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the Admin model
const Admin = mongoose.model("Admin", adminSchema, "Admin");

// Export the model
module.exports = Admin;
