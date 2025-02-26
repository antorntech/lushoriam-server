const express = require("express");
const app = express.Router();

const productsController = require("../../controllers/products.controller");

app.get("/", productsController.getProducts);
app.get("/recent", productsController.getRecentProducts);
app.get("/:productsId", productsController.singleProducts);
app.post("/add", upload.single("banner"), productsController.addProducts);
app.put(
  "/update/:productsId",
  upload.single("banner"),
  productsController.updateProducts
);
app.patch("/status/:productsId", productsController.updateProductStatus);
app.delete("/delete/:productsId", productsController.deleteProducts);

module.exports = app;
