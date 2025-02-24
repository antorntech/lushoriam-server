const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/lushoriam-db";

const connection = async () => {
  try {
    await mongoose.connect(url);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
