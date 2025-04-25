const mongoose = require("mongoose");

const returnParcelSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReturnParcel",
  returnParcelSchema,
  "ReturnParcels"
);
