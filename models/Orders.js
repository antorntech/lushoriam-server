const mongoose = require("mongoose");

// Define the main Training schema
const ordersSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  details: {
    type: String,
  },
  banner: {
    type: String, // Assuming this will hold the image URL or file path
  },
});

// Export the Order model
module.exports = mongoose.model("Order", ordersSchema, "Orders");
