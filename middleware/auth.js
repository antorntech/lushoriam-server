const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "accessSecret123";

module.exports.auth = (req, res, next) => {
  try {
    // Get token from the authorization header
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Please authenticate" });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    // Attach the admin ID from the token to the request object
    req.adminId = decoded.adminId;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({
      message: "Unauthorized! Please authenticate",
      error: error.message,
    });
  }
};
