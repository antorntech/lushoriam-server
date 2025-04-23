const express = require("express");
const app = express.Router();

const reviewsController = require("../../controllers/reviews.controller");

const { auth } = require("../../middleware/auth");

app.get("/", auth, reviewsController.getReviews);
app.get("/recent", auth, reviewsController.getRecentReviews);
app.get("/:reviewsId", auth, reviewsController.singleReviews);
app.post(
  "/add",
  auth,
  upload.single("avatar"),
  auth,
  reviewsController.addReviews
);
app.put(
  "/update/:reviewsId",
  auth,
  upload.single("avatar"),
  reviewsController.updateReviews
);
app.delete("/delete/:reviewsId", auth, reviewsController.deleteReviews);

module.exports = app;
