const express = require("express");
const app = express.Router();

const reviewsController = require("../../controllers/reviews.controller");

app.get("/", reviewsController.getReviews);
app.get("/recent", reviewsController.getRecentReviews);
app.get("/:reviewsId", reviewsController.singleReviews);
app.post("/add", upload.single("logo"), reviewsController.addReviews);
app.put(
  "/update/:reviewsId",
  upload.single("logo"),
  reviewsController.updateReviews
);
app.delete("/delete/:reviewsId", reviewsController.deleteReviews);

module.exports = app;
