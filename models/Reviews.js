const mongoose = require("mongoose");

// Define the main Training schema
const reviewsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  designation: {
    type: String,
  },
  comments: {
    type: String,
  },
  logo: {
    type: String, // Assuming this will hold the image URL or file path
  },
});

// Export the Review model
module.exports = mongoose.model("Review", reviewsSchema, "Reviews");
