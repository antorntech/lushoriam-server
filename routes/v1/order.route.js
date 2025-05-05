const express = require("express");
const app = express.Router();

const ordersController = require("../../controllers/orders.controller");

const { auth } = require("../../middleware/auth");

// Place a new order
app.post("/", ordersController.placeOrder);

// Get all orders
app.get("/simply", auth, ordersController.getOrdersSimply);

// Get all orders
app.get("/", auth, ordersController.getOrders);

// Get a single order by ID
app.get("/:id", auth, ordersController.getOrderById);

// Update order status
app.put("/:id", auth, ordersController.updateOrderStatus);

// Delete an order
app.delete("/:id", auth, ordersController.deleteOrder);

module.exports = app;
