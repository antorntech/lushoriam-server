const express = require("express");
const app = express.Router();

const slidersController = require("../../controllers/sliders.controller");

const { auth } = require("../../middleware/auth");

app.get("/", auth, slidersController.getSliders);
app.get("/recent", auth, slidersController.getRecentSliders);
app.get("/:slidersId", auth, slidersController.singleSliders);
app.post("/add", upload.single("banner"), slidersController.addSliders);
app.put(
  "/update/:slidersId",
  upload.single("banner"),
  slidersController.updateSliders
);
app.delete("/delete/:slidersId", auth, slidersController.deleteSliders);

module.exports = app;
