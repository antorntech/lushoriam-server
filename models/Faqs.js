const mongoose = require("mongoose");

// Define the main Training schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

// Export the Faq model
module.exports = mongoose.model("Faq", faqSchema, "Faqs");
