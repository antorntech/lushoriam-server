const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    delivery: { type: String, enum: ["inside", "outside"], required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema, "Orders");
