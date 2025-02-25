const Reviews = require("../models/Reviews");

// Get all reviews
module.exports.getReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find({});
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get recent reviews (last 3)
module.exports.getRecentReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find({});
    const recentReviews = reviews.reverse().slice(0, 3);
    res.status(200).send(recentReviews);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a single training by ID
module.exports.singleReviews = async (req, res) => {
  try {
    const { reviewsId } = req.params;
    const reviews = await Reviews.findById(reviewsId);
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add a new training
module.exports.addReviews = async (req, res) => {
  try {
    if (req.file) {
      Object.assign(req.body, {
        logo: "/uploads/images/" + req.file.filename,
      });
    }

    const newReviews = await Reviews.create(req.body);

    res.status(201).json({
      status: "success",
      message: "New Review created successfully!",
      data: newReviews,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Update a training by ID
module.exports.updateReviews = async (req, res) => {
  try {
    const { reviewsId } = req.params;

    if (req.file) {
      Object.assign(req.body, {
        logo: "/uploads/images/" + req.file.filename,
      });
    }

    const updatedReview = await Reviews.findByIdAndUpdate(reviewsId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Review updated successfully!",
      data: updatedReview,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Delete a training by ID
module.exports.deleteReviews = async (req, res) => {
  try {
    const { reviewsId } = req.params;
    const training = await Reviews.findByIdAndDelete(reviewsId);
    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
      data: training,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
