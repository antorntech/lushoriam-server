const axios = require("axios");
const crypto = require("crypto");

// ✅ Email or Mobile hash function (SHA-256)
const hashEmail = (str) => {
  if (!str) return "";
  return crypto
    .createHash("sha256")
    .update(str.trim().toLowerCase())
    .digest("hex");
};

// ✅ Generate unique event ID for deduplication (Node 14.17+)
const generateEventId = () => {
  return crypto.randomUUID();
};

/**
 * ✅ Send server-side event to Facebook Conversion API
 *
 * @param {string} eventName - Example: 'PageView', 'Purchase'
 * @param {Object} userData - Required hashed user info (em, ip, ua, etc.)
 * @param {Object} eventData - Optional: value, content_ids, currency, etc.
 * @param {string} eventId - Optional: custom deduplication ID
 * @param {string} testEventCode - Optional: FB test event code
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

    // ✅ Ensure valid 'value' & 'currency'
    const safeEventData = {
      ...eventData,
      value:
        typeof eventData.value === "number"
          ? eventData.value
          : Number(eventData.value) || 0,
      currency: (eventData.currency || "BDT").toUpperCase(), // fallback to BDT
    };

    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: safeEventData,
      action_source: "website",
    };

    // ✅ Add event_id for deduplication
    if (eventId) {
      eventPayload.event_id = eventId;
    }

    const payload = {
      data: [eventPayload],
      access_token: process.env.FB_ACCESS_TOKEN,
    };

    // ✅ Add test event code (if provided or from .env)
    if (testEventCode || process.env.FB_TEST_CODE) {
      payload.test_event_code = testEventCode || process.env.FB_TEST_CODE;
    }

    const response = await axios.post(url, payload);

    console.log(
      "✅ Facebook Pixel Payload Sent:",
      JSON.stringify(payload, null, 2)
    );
    console.log("✅ Facebook Response:", response.data);
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
