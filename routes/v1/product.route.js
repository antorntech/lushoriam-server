const express = require("express");
const app = express.Router();

const productsController = require("../../controllers/products.controller");

const { auth } = require("../../middleware/auth");

app.get("/", auth, productsController.getProducts);
app.get("/recent", auth, productsController.getRecentProducts);
app.get("/:productsId", auth, productsController.singleProducts);
app.post("/add", auth, upload.single("banner"), productsController.addProducts);
app.put(
  "/update/:productsId",
  auth,
  upload.single("banner"),
  productsController.updateProducts
);
app.patch("/status/:productsId", auth, productsController.updateProductStatus);
app.delete("/delete/:productsId", auth, productsController.deleteProducts);

module.exports = app;
