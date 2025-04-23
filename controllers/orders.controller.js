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

// exports.placeOrder = async (req, res) => {
//   try {
//     const {
//       name,
//       address,
//       mobile,
//       delivery,
//       productId,
//       productName,
//       productImage,
//       quantity,
//       price,
//       totalAmount,
//     } = req.body;

//     // 🔍 ফিল্ড ভেরিফিকেশন
//     if (
//       !name ||
//       !address ||
//       !mobile ||
//       !productId ||
//       !productName ||
//       !productImage ||
//       !quantity ||
//       !price ||
//       !totalAmount
//     ) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // ✅ প্রোডাক্ট চেক করা
//     const product = await Products.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found." });
//     }

//     if (product.quantity < quantity) {
//       return res.status(400).json({ message: "Not enough stock available." });
//     }

//     const uniqueOrderId = Date.now().toString();

//     const newOrder = new Orders({
//       orderId: uniqueOrderId,
//       name,
//       address,
//       mobile,
//       delivery,
//       productId,
//       productName,
//       productImage,
//       quantity,
//       price: product.price,
//       totalAmount,
//     });

//     await newOrder.save();

//     // ✉️ Nodemailer দিয়ে মেইল পাঠানো
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "lushoriam@gmail.com", // তোমার Gmail
//         pass: "csin jlhd ookt piss", // Gmail এর App Password (not your main password)
//       },
//     });

//     const mailOptions = {
//       from: "lushoriam@gmail.com",
//       to: "lushoriam@gmail.com", // কাস্টমার অথবা নিজেকে পাঠাতে পারো
//       subject: "New Customer Order Received",
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//           <h2 style="color: #007BFF;">🛒 New Order Received</h2>
//           <p>Hello Admin,</p>
//           <p>You have received a new order with the following details:</p>

//           <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin: 20px 0;">
//             <tbody>
//               <tr style="background-color: #f9f9f9;">
//                 <td style="padding: 10px; border: 1px solid #ddd;"><strong>Customer Name</strong></td>
//                 <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 10px; border: 1px solid #ddd;"><strong>Address</strong></td>
//                 <td style="padding: 10px; border: 1px solid #ddd;">${address}</td>
//               </tr>
//               <tr style="background-color: #f9f9f9;">
//                 <td style="padding: 10px; border: 1px solid #ddd;"><strong>Mobile</strong></td>
//                 <td style="padding: 10px; border: 1px solid #ddd;">${mobile}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 10px; border: 1px solid #ddd;"><strong>Product</strong></td>
//                 <td style="padding: 10px; border: 1px solid #ddd;">${productName}</td>
//               </tr>
//               <tr style="background-color: #f9f9f9;">
//                 <td style="padding: 10px; border: 1px solid #ddd;"><strong>Quantity</strong></td>
//                 <td style="padding: 10px; border: 1px solid #ddd;">${quantity} pcs</td>
//               </tr>
//               <tr>
//                 <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Amount</strong></td>
//                 <td style="padding: 10px; border: 1px solid #ddd;">৳ ${totalAmount}</td>
//               </tr>
//             </tbody>
//           </table>

//           <p style="margin-top: 20px;">Please check the dashboard for more details.</p>
//           <p style="color: #555;">Regards,<br><strong>Lushoriam</strong></p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({
//       message: "Order placed successfully & email sent!",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error("Order error:", error);
//     res.status(500).json({
//       message: "Server error, try again later.",
//       error: error.message,
//     });
//   }
// };

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
