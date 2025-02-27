const Orders = require("../models/Orders");
const Products = require("../models/Products");

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
      totalAmount,
    } = req.body;

    console.log(productId);
    if (
      !name ||
      !address ||
      !mobile ||
      !productId ||
      !productName ||
      !productImage ||
      !quantity ||
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

    const uniqueOrderId = Date.now().toString();

    const newOrder = new Orders({
      orderId: uniqueOrderId,
      name,
      address,
      mobile,
      delivery,
      productId: productId,
      productName: productName,
      productImage: productImage,
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

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status, productId } = req.body;

//     const order = await Orders.findById(req.params.id);

//     if (!order) return res.status(404).json({ message: "Order not found." });

//     order.status = status || order.status;
//     await order.save();
//     res.status(200).json({ message: "Order status updated!", order });
//   } catch (error) {
//     res.status(500).json({ message: "Server error, try again later.", error });
//   }
// };

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, productId } = req.body;

    console.log(productId);
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
