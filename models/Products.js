const mongoose = require("mongoose");

// Define the main Training schema
const productsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  details: {
    type: String,
  },
  banner: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

// Export the Product model
module.exports = mongoose.model("Product", productsSchema, "Products");
