const Products = require("../models/Products");

// Get all products
module.exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get recent products (last 3)
module.exports.getRecentProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    const recentProducts = products.reverse().slice(0, 3);
    res.status(200).send(recentProducts);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a single training by ID
module.exports.singleProducts = async (req, res) => {
  try {
    const { productsId } = req.params;
    const products = await Products.findById(productsId);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add a new training
module.exports.addProducts = async (req, res) => {
  try {
    if (req.file) {
      Object.assign(req.body, {
        banner: "/uploads/images/" + req.file.filename,
      });
    }

    const newProducts = await Products.create(req.body);

    res.status(201).json({
      status: "success",
      message: "New Product created successfully!",
      data: newProducts,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Update a training by ID
module.exports.updateProducts = async (req, res) => {
  try {
    const { productsId } = req.params;

    if (req.file) {
      Object.assign(req.body, {
        banner: "/uploads/images/" + req.file.filename,
      });
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      productsId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Delete a training by ID
module.exports.deleteProducts = async (req, res) => {
  try {
    const { productsId } = req.params;
    const training = await Products.findByIdAndDelete(productsId);
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      data: training,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
