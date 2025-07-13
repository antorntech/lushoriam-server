// // utils/fbPixel.js
// const axios = require("axios");
// const crypto = require("crypto");

// // ✅ Email/Mobile hash function
// const hashEmail = (str) => {
//   return crypto
//     .createHash("sha256")
//     .update(str.trim().toLowerCase())
//     .digest("hex");
// };

// /**
//  * Facebook Conversion API কল
//  * @param {string} eventName - যেমন 'PageView', 'Purchase'
//  * @param {Object} userData - hashed email, ip, ua
//  * @param {Object} eventData - যেমন: value, content_ids
//  * @param {string} eventId - optional, ইভেন্ট ট্র্যাকিং আইডি
//  * @param {string} testEventCode - optional, ফেসবুক টেস্ট ইভেন্ট কোড
//  */
// const sendServerSideEvent = async ({
//   eventName,
//   userData = {},
//   eventData = {},
//   eventId,
//   testEventCode,
// }) => {
//   try {
//     const url = `https://graph.facebook.com/v18.0/${process.env.FB_PIXEL_ID}/events`;

//     const eventPayload = {
//       event_name: eventName,
//       event_time: Math.floor(Date.now() / 1000),
//       user_data: userData,
//       custom_data: eventData,
//       action_source: "website",
//     };

//     // ✅ Optional event_id (for deduplication)
//     if (eventId) {
//       eventPayload.event_id = eventId;
//     }

//     const payload = {
//       data: [eventPayload],
//       access_token: process.env.FB_ACCESS_TOKEN,
//     };

//     // ✅ Optional test_event_code (for Events Manager debug)
//     if (testEventCode || process.env.FB_TEST_CODE) {
//       payload.test_event_code = testEventCode || process.env.FB_TEST_CODE;
//     }

//     const response = await axios.post(url, payload);
//     console.log("✅ Facebook Pixel Event Sent:", response.data);
//   } catch (error) {
//     console.error(
//       "❌ Facebook Pixel Error:",
//       error?.response?.data || error.message
//     );
//   }
// };

// module.exports = {
//   sendServerSideEvent,
//   hashEmail,
// };

// utils/fbPixel.js
const axios = require("axios");
const crypto = require("crypto");

// ✅ Email/Mobile hash function (SHA-256)
const hashEmail = (str) => {
  return crypto
    .createHash("sha256")
    .update(str.trim().toLowerCase())
    .digest("hex");
};

// ✅ Generate unique event ID (used for deduplication)
const generateEventId = () => {
  return crypto.randomUUID(); // Node.js v14.17+ supports this
};

/**
 * Send Facebook Conversion API event (for deduplication with browser pixel)
 *
 * @param {string} eventName - Example: 'PageView', 'Purchase'
 * @param {Object} userData - Must include hashed email, ip, ua
 * @param {Object} eventData - Optional: value, content_ids, currency etc.
 * @param {string} eventId - Unique string to match with browser-side event
 * @param {string} testEventCode - Optional FB Events Manager test code
 */
const sendServerSideEvent = async ({
  eventName,
  userData = {},
  eventData = {},
  eventId,
  testEventCode,
}) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.FB_PIXEL_ID}/events`;

    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: eventData,
      action_source: "website",
    };

    if (eventId) {
      eventPayload.event_id = eventId; // ✅ used for deduplication
    }

    const payload = {
      data: [eventPayload],
      access_token: process.env.FB_ACCESS_TOKEN,
    };

    if (testEventCode || process.env.FB_TEST_CODE) {
      payload.test_event_code = testEventCode || process.env.FB_TEST_CODE;
    }

    const response = await axios.post(url, payload);
    console.log("✅ Payload:", payload);
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
  generateEventId,
};
