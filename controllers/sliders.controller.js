const Sliders = require("../models/Sliders");

// Get all sliders
module.exports.getSliders = async (req, res) => {
  try {
    const sliders = await Sliders.find({});
    res.status(200).send(sliders);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get recent sliders (last 3)
module.exports.getRecentSliders = async (req, res) => {
  try {
    const sliders = await Sliders.find({});
    const recentSliders = sliders.reverse().slice(0, 3);
    res.status(200).send(recentSliders);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a single training by ID
module.exports.singleSliders = async (req, res) => {
  try {
    const { slidersId } = req.params;
    const sliders = await Sliders.findById(slidersId);
    res.status(200).send(sliders);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add a new training
module.exports.addSliders = async (req, res) => {
  try {
    if (req.file) {
      Object.assign(req.body, {
        banner: "/uploads/images/" + req.file.filename,
      });
    }

    const newSliders = await Sliders.create(req.body);

    res.status(201).json({
      status: "success",
      message: "New Slider created successfully!",
      data: newSliders,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Update a training by ID
module.exports.updateSliders = async (req, res) => {
  try {
    const { slidersId } = req.params;

    if (req.file) {
      Object.assign(req.body, {
        banner: "/uploads/images/" + req.file.filename,
      });
    }

    const updatedSlider = await Sliders.findByIdAndUpdate(slidersId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSlider) {
      return res.status(404).json({
        status: "fail",
        message: "Slider not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Slider updated successfully!",
      data: updatedSlider,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Delete a training by ID
module.exports.deleteSliders = async (req, res) => {
  try {
    const { slidersId } = req.params;
    const training = await Sliders.findByIdAndDelete(slidersId);
    res.status(200).json({
      status: "success",
      message: "Slider deleted successfully",
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
