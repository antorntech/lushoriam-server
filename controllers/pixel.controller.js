// controllers/pixel.controller.js

const { sendServerSideEvent } = require("../utils/fbPixel");

exports.trackPageView = async (req, res) => {
  try {
    await sendServerSideEvent({
      eventName: "PageView",
      userData: {
        client_ip_address: req.ip,
        client_user_agent: req.headers["user-agent"],
        em: req.body.email ? [hashEmail(req.body.email)] : [],
      },
      eventData: {},
    });

    res.status(200).json({ message: "✅ PageView Tracked" });
  } catch (error) {
    console.error("❌ PageView Track Error:", error.message);
    res.status(500).json({ message: "Failed to track PageView" });
  }
};
