const mongoose = require("mongoose");

// Define the Product schema
const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  banner: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
});

// Export the Product model
module.exports = mongoose.model("Product", productsSchema, "Products");
