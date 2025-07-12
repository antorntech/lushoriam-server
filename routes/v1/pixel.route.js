const express = require("express");
const app = express.Router();
const { trackPageView } = require("../../controllers/pixel.controller");

app.post("/pageview", trackPageView);

module.exports = app;
