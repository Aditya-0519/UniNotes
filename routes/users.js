const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");
const userController = require("../controllers/userController");

router.get("/profile", isLoggedIn, userController.myProfile);

router.get(
    "/leaderboard",
    userController.leaderboard
);

router.get("/:id", userController.profile);

module.exports = router;