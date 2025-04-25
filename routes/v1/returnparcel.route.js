const express = require("express");
const app = express.Router();

const returnparcelController = require("../../controllers/returnparcel.controller");

const { auth } = require("../../middleware/auth");

app.get("/", auth, returnparcelController.getAllReturnParcels);
app.get("/:returnparcelsId", auth, returnparcelController.getReturnParcelById);
app.post("/add", auth, returnparcelController.createReturnParcel);
app.put(
  "/update/:returnparcelsId",
  auth,
  returnparcelController.updateReturnParcelStatus
);
app.delete(
  "/delete/:returnparcelsId",
  auth,
  returnparcelController.deleteReturnParcel
);

module.exports = app;
