const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn")

const institutionController = require("../controllers/institutionController");


router.get(
    "/request",
    isLoggedIn,
    institutionController.requestForm
);

router.post(
    "/request",
    isLoggedIn,
    institutionController.createRequest
);
router.get("/:id", institutionController.show);

module.exports = router;