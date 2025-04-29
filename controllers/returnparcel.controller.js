const Orders = require("../models/Orders");
const ReturnParcel = require("../models/ReturnParcel");

// 📌 Create Return Parcel
exports.createReturnParcel = async (req, res) => {
  try {
    const { customerId, orderId, customerName, mobile, reason } = req.body;

    // Validate request
    if (!customerId || !orderId || !customerName || !mobile || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Creating a new return parcel with default values for status and requestedAt
    const newReturn = new ReturnParcel({
      customerId,
      orderId,
      customerName,
      mobile,
      reason,
      status: "pending", // Default status is 'pending'
      requestedAt: Date.now(), // Set the time when return is requested
    });

    // Save the return parcel to the database
    const savedReturn = await newReturn.save();

    res.status(201).json({ success: true, data: savedReturn });
  } catch (err) {
    console.error("Error creating return parcel:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// 📌 Get All Return Parcels
exports.getAllReturnParcels = async (req, res) => {
  try {
    const returns = await ReturnParcel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: returns });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// 📌 Get Single Return Parcel by ID
exports.getReturnParcelById = async (req, res) => {
  try {
    const { id } = req.params;
    const singleReturn = await ReturnParcel.findById(id);

    if (!singleReturn) {
      return res
        .status(404)
        .json({ success: false, message: "Return parcel not found" });
    }

    res.status(200).json({ success: true, data: singleReturn });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// 📌 Update Return Parcel
exports.updateReturnParcelStatus = async (req, res) => {
  try {
    const { returnparcelsId } = req.params;
    const { status } = req.body;

    // Validate the status to ensure it's a valid value
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Update the return parcel with the new status
    const updated = await ReturnParcel.findByIdAndUpdate(
      returnparcelsId,
      {
        status,
        processedAt: status !== "pending" ? Date.now() : null, // Set processedAt only if status is not "pending"
      },
      { new: true }
    );

    console.log(updated);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Return parcel not found" });
    }

    // If the return status is approved, update the related order's status
    if (status === "approved") {
      const orderUpdated = await Orders.findByIdAndUpdate(updated.customerId, {
        status: "returned", // Or the status you want for the order
      });

      if (!orderUpdated) {
        return res.status(404).json({
          success: false,
          message: "Related order not found",
        });
      }
    } else if (status === "rejected") {
      const orderUpdated = await Orders.findByIdAndUpdate(updated.customerId, {
        status: "rejected",
      });

      if (!orderUpdated) {
        return res.status(404).json({
          success: false,
          message: "Related order not found",
        });
      }
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// 📌 Delete Return Parcel
exports.deleteReturnParcel = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ReturnParcel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Return parcel not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Return parcel deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
