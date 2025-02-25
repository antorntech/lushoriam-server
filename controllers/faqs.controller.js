const Faqs = require("../models/Faqs");

// Get all faqs
module.exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faqs.find({});
    res.status(200).send(faqs);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get recent faqs (last 3)
module.exports.getRecentFaqs = async (req, res) => {
  try {
    const faqs = await Faqs.find({});
    const recentFaqs = faqs.reverse().slice(0, 3);
    res.status(200).send(recentFaqs);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a single faq by ID
module.exports.singleFaqs = async (req, res) => {
  try {
    const { faqsId } = req.params;
    const faqs = await Faqs.findById(faqsId);
    res.status(200).send(faqs);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add a new faq
module.exports.addFaqs = async (req, res) => {
  try {
    console.log(req.body);

    const newFaqs = await Faqs.create(req.body);

    res.status(201).json({
      status: "success",
      message: "New Faq created successfully!",
      data: newFaqs,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Update a faq by ID
module.exports.updateFaqs = async (req, res) => {
  try {
    const { faqsId } = req.params;

    const updatedFaq = await Faqs.findByIdAndUpdate(faqsId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedFaq) {
      return res.status(404).json({
        status: "fail",
        message: "Faq not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Faq updated successfully!",
      data: updatedFaq,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Delete a faq by ID
module.exports.deleteFaqs = async (req, res) => {
  try {
    const { faqsId } = req.params;
    const faq = await Faqs.findByIdAndDelete(faqsId);
    res.status(200).json({
      status: "success",
      message: "Faq deleted successfully",
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
