const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vtlneg9.mongodb.net/`;

const connection = async () => {
  try {
    await mongoose.connect(url);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
