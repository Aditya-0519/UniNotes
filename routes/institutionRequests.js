const express = require("express");
const router = express.Router();

const institutionRequestController =
require("../controllers/institutionRequestController");

router.get(
    "/new",
    institutionRequestController.newForm
);

router.post(
    "/",
    institutionRequestController.createRequest
);

module.exports = router;