const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  banner: {
    type: String,
  },
});

module.exports = mongoose.model("Blogs", blogsSchema, "Blogs");
