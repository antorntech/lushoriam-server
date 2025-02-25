const express = require("express");
const app = express.Router();

const faqsController = require("../../controllers/faqs.controller");

app.get("/", faqsController.getFaqs);
app.get("/recent", faqsController.getRecentFaqs);
app.get("/:faqsId", faqsController.singleFaqs);
app.post("/add", faqsController.addFaqs);
app.put("/update/:faqsId", faqsController.updateFaqs);
app.delete("/delete/:faqsId", faqsController.deleteFaqs);

module.exports = app;
