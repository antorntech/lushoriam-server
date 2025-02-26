const express = require("express");
const app = express.Router();

const ordersController = require("../../controllers/orders.controller");

// Place a new order
app.post("/", ordersController.placeOrder);

// Get all orders
app.get("/", ordersController.getOrders);

// Get a single order by ID
app.get("/:id", ordersController.getOrderById);

// Update order status
app.put("/:id", ordersController.updateOrderStatus);

// Delete an order
app.delete("/:id", ordersController.deleteOrder);

module.exports = app;
