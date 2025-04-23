const mongoose = require("mongoose");

const url = process.env.DB_URL;

const connection = async () => {
  try {
    await mongoose.connect(url);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
