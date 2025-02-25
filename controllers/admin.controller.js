const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET_KEY = "accessSecret123";
const REFRESH_TOKEN_SECRET_KEY = "refreshSecret123";

// Utility to generate access and refresh tokens
const generateTokens = (admin) => {
  const accessToken = jwt.sign({ adminId: admin._id }, JWT_SECRET_KEY, {
    expiresIn: "1h", // Access token expires in 1 hour
  });

  const refreshToken = jwt.sign(
    { adminId: admin._id },
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "1h" } // Refresh token expires in 1 hour
  );

  return { accessToken, refreshToken };
};

module.exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(newAdmin);

    return res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(admin);

    return res.status(200).json({
      message: "Login successful",
      admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
    const adminId = decoded.adminId;

    // Generate new access token with a 24-hour expiration
    const newAccessToken = jwt.sign({ adminId }, JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

module.exports.getAdmin = async (req, res) => {
  try {
    const admins = await Admin.findOne({});
    return res
      .status(200)
      .json({ message: "Admins fetched successfully", admins: admins });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports.updatedAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { username, email, password } = req.body;

    // Check if the admin with the given ID exists
    const adminToUpdate = await Admin.findById({ _id: adminId });

    if (!adminToUpdate) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Hash the new password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update admin's details
    adminToUpdate.username = username || adminToUpdate.username;
    adminToUpdate.email = email || adminToUpdate.email;
    adminToUpdate.password = hashedPassword || adminToUpdate.password;

    await adminToUpdate.save();

    return res
      .status(200)
      .json({ message: "Admin updated successfully", admin: adminToUpdate });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
