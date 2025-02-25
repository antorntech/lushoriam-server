const mongoose = require("mongoose");

// Define the main Training schema
const slidersSchema = new mongoose.Schema({
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

// Export the Slider model
module.exports = mongoose.model("Slider", slidersSchema, "Sliders");
