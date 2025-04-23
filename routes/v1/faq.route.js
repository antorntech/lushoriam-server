const express = require("express");
const app = express.Router();

const faqsController = require("../../controllers/faqs.controller");

const { auth } = require("../../middleware/auth");

app.get("/", auth, faqsController.getFaqs);
app.get("/recent", auth, faqsController.getRecentFaqs);
app.get("/:faqsId", auth, faqsController.singleFaqs);
app.post("/add", faqsController.addFaqs);
app.put("/update/:faqsId", faqsController.updateFaqs);
app.delete("/delete/:faqsId", auth, faqsController.deleteFaqs);

module.exports = app;
