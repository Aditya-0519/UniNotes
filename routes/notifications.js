const express = require("express");
const router = express.Router();

const notificationController =
    require("../controllers/notificationController");


// ==========================================
// 🔑 VAPID PUBLIC KEY
// ==========================================

router.get(
    "/public-key",
    notificationController.getPublicKey
);


// ==========================================
// 🔔 SAVE PUSH SUBSCRIPTION
// ==========================================

router.post(
    "/subscribe",
    notificationController.subscribe
);


// ==========================================
// 🧪 TEST NOTIFICATION
// ==========================================
// Development/testing only.
// The controller will block this in production.

router.post(
    "/test",
    notificationController.testNotification
);


module.exports = router;