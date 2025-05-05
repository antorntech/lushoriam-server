const Orders = require("../models/Orders");
const Products = require("../models/Products");
// const nodemailer = require("nodemailer");

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const {
      name,
      address,
      mobile,
      delivery,
      productId,
      productName,
      productImage,
      quantity,
      price,
      totalAmount,
    } = req.body;

    if (
      !name ||
      !address ||
      !mobile ||
      !productId ||
      !productName ||
      !productImage ||
      !quantity ||
      !price ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Find the product in the database
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // ✅ Check if enough stock is available
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    const uniqueOrderId = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newOrder = new Orders({
      orderId: "L" + uniqueOrderId,
      name,
      address,
      mobile,
      delivery,
      productId: productId,
      productName: productName,
      productImage: productImage,
      quantity,
      price: product.price,
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

// Get all orders with pagination
exports.getOrdersSimply = async (req, res) => {
  try {
    const totalOrders = await Orders.countDocuments();
    const orders = await Orders.find();

    res.status(200).json({
      orders,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later.", error });
  }
};

// Get today's confirmed orders
exports.getTodaysConfirmedOrders = async (req, res) => {
  try {
    const today = new Date();
    // Set start of today (00:00 AM)
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    // Set end of today (11:59:59 PM)
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // MongoDB query to count confirmed orders created today
    const confirmedOrdersCount = await Orders.countDocuments({
      deliveryStatus: "confirmed", // Make sure this field is 'confirmed' in your data
      createdAt: {
        $gte: startOfDay, // Greater than or equal to startOfDay
        $lte: endOfDay, // Less than or equal to endOfDay
      },
    });

    res.status(200).json({ confirmedOrdersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, try again later.", error });
  }
};

exports.getOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  // 🔍 Multiple fields search
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { orderId: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  try {
    const totalOrders = await Orders.countDocuments(query);
    const orders = await Orders.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, productId } = req.body;

    const order = await Orders.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found." });

    // Check if the new status is 'Delivered' and the order wasn't already delivered
    if (status === "delivered" && order.status !== "delivered") {
      // Find the product in the database
      const product = await Products.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      // Update the product quantity
      product.quantity -= order.quantity;
      await product.save();
    }

    order.status = status || order.status;
    await order.save();

    res.status(200).json({ message: "Order status updated!", order });
  } catch (error) {
    console.error(error);
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
