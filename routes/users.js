const express = require("express");

const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const userController = require("../controllers/userController");

const avatarUpload = require("../middleware/avatarUpload");


router.get(
    "/profile",
    isLoggedIn,
    userController.myProfile
);


router.post(
    "/profile/avatar",
    isLoggedIn,
    avatarUpload.single("avatar"),
    userController.updateAvatar
);


router.get(
    "/leaderboard",
    userController.leaderboard
);


router.get(
    "/:id",
    userController.profile
);


module.exports = router;