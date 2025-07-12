const { sendServerSideEvent, hashEmail } = require("../utils/fbPixel");

exports.trackPageView = async (req, res) => {
  try {
    const email = req.body.email;

    // ✅ Prepare user data
    const userData = {
      client_ip_address:
        req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      client_user_agent: req.headers["user-agent"],
    };

    if (email) {
      userData.em = [hashEmail(email)];
    }

    // ✅ Send PageView event
    await sendServerSideEvent({
      eventName: "PageView",
      userData,
      eventData: {},
      eventId: `pageview-${Date.now()}`, // Optional deduplication ID
    });

    res.status(200).json({ message: "✅ PageView Tracked" });
  } catch (error) {
    console.error(
      "❌ PageView Track Error:",
      error?.response?.data || error.message
    );
    res.status(500).json({ message: "Failed to track PageView" });
  }
};
