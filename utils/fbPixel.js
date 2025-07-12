// utils/fbPixel.js
const axios = require("axios");
const crypto = require("crypto");

/**
 * যেকোনো string (email/mobile) কে SHA256 হ্যাশ করার ফাংশন
 * Facebook Conversion API hashed data expects this
 */
const hashEmail = (str) => {
  return crypto
    .createHash("sha256")
    .update(str.trim().toLowerCase())
    .digest("hex");
};

/**
 * Facebook Conversion API (server-side pixel) কল করার ফাংশন
 * @param {string} eventName - যেমন 'PageView', 'Purchase', 'AddToCart'
 * @param {Object} userData - IP, User-Agent, hashed email/mobile
 * @param {Object} eventData - optional data: price, content_ids, value
 */
const sendServerSideEvent = async ({
  eventName,
  userData = {},
  eventData = {},
}) => {
  try {
    const url = `https://graph.facebook.com/v23.0/${process.env.FB_PIXEL_ID}/events`;

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          user_data: userData,
          custom_data: eventData,
          action_source: "website",
        },
      ],
      access_token: process.env.FB_ACCESS_TOKEN,
    };

    const response = await axios.post(url, payload);
    console.log("✅ Facebook Pixel Event Sent:", response.data);
  } catch (error) {
    console.error(
      "❌ Facebook Pixel Error:",
      error?.response?.data || error.message
    );
  }
};

module.exports = {
  sendServerSideEvent,
  hashEmail,
};
