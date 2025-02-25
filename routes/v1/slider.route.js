const express = require("express");
const app = express.Router();

const slidersController = require("../../controllers/sliders.controller");

app.get("/", slidersController.getSliders);
app.get("/recent", slidersController.getRecentSliders);
app.get("/:slidersId", slidersController.singleSliders);
app.post("/add", upload.single("banner"), slidersController.addSliders);
app.put(
  "/update/:slidersId",
  upload.single("banner"),
  slidersController.updateSliders
);
app.delete("/delete/:slidersId", slidersController.deleteSliders);

module.exports = app;
