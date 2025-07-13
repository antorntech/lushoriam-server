const {
  sendServerSideEvent,
  hashEmail,
  generateEventId,
} = require("../utils/fbPixel");

exports.trackPageView = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Prepare user_data for Facebook CAPI
    const userData = {
      client_ip_address:
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.info?.remoteAddress ||
        null,
      client_user_agent: req.headers["user-agent"] || null,
    };

    // ✅ Add hashed email (if provided)
    if (email) {
      userData.em = [hashEmail(email)];
    }

    // ✅ Generate unique event ID (used for deduplication)
    const eventId = generateEventId();

    // ✅ Optional: custom_data for more tracking (like page, tags, etc.)
    const eventData = {
      page_title: req.headers.referer || "Unknown Page",
    };

    // ✅ Send server-side PageView event
    await sendServerSideEvent({
      eventName: "PageView",
      userData,
      eventData,
      eventId,
    });

    return res.status(200).json({
      message: "✅ PageView tracked successfully",
      eventId, // frontend can also use this to deduplicate
    });
  } catch (error) {
    console.error(
      "❌ PageView Track Error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      message: "❌ Failed to track PageView",
      error: error?.message || "Unknown error",
    });
  }
};
