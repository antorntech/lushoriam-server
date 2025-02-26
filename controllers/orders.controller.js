const Orders = require("../models/Orders");

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const {
      name,
      address,
      mobile,
      delivery,
      productName,
      productImage,
      quantity,
      totalAmount,
    } = req.body;

    if (
      !name ||
      !address ||
      !mobile ||
      !productName ||
      !productImage ||
      !quantity ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const uniqueOrderId = Date.now().toString();

    const newOrder = new Orders({
      orderId: uniqueOrderId,
      name,
      address,
      mobile,
      delivery,
      productName,
      productImage,
      quantity,
      totalAmount,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later.", error });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Orders.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later.", error });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later.", error });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Orders.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found." });

    order.status = status || order.status;
    await order.save();
    res.status(200).json({ message: "Order status updated!", order });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later.", error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Orders.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found." });

    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later.", error });
  }
};
