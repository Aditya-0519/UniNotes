const User = require("../models/user");
const Contribution = require("../models/contribution");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const reputation = require("../utils/reputation");
const badges = require("../utils/badges");
const { cloudinary } = require("../middleware/upload");

exports.myProfile = catchAsync(async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        const err = new Error("Invalid User ID");
        err.status = 400;
        throw err;
    }

    const user = await User.findById(req.user._id)
        .populate("institution");

    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    const contributions = await Contribution.find({
        contributor: req.user._id
    }).sort({ createdAt: -1 });

    const totalViews = contributions.reduce((sum, note) => {
        return sum + (note.stats?.views || 0);
    }, 0);

    res.render("users/myProfile", {
    user,
    contributions,
    totalViews,
    badge: reputation.getBadge(user.reputation),
    isOwnProfile: true
});

});

exports.profile = catchAsync(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .populate("institution");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        const notes = await Contribution.find({
            contributor: user._id,
            status: "approved",
            visibility: "public"
        })
        .populate("institution", "name shortName")
        .sort({ createdAt: -1 });

        const totalViews = notes.reduce(
    (sum, note) => sum + (note.stats?.views || 0),
    0
);

      res.render("users/myProfile", {
    user,
    contributions: notes,
    totalViews,
    badge: badges.getBadge(user.reputation),
    isOwnProfile: req.user
        ? req.user._id.toString() === user._id.toString()
        : false
});

    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
});

exports.leaderboard = catchAsync(async (req, res) => {

    const users = await User.find({})
        .populate("institution", "shortName name")
        .sort({
            reputation: -1,
            contributionCount: -1
        })
        .limit(50);

    res.render("users/leaderboard", {
        users,
        badges
    });

});

exports.updateAvatar = catchAsync(async (req, res) => {

    if (!req.file) {
        req.flash("error", "Please select an image.");
        return res.redirect("/users/profile");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/users/profile");
    }

    // Delete previous avatar from Cloudinary
    if (user.avatar) {

        try {

            const urlParts = user.avatar.split("/");

            const uploadIndex = urlParts.indexOf("upload");

            if (uploadIndex !== -1) {

                let publicIdParts = urlParts.slice(uploadIndex + 1);

                // Remove transformation/version folders
                if (publicIdParts[0]?.startsWith("v")) {
                    publicIdParts.shift();
                }

                const publicId = publicIdParts
                    .join("/")
                    .replace(/\.[^/.]+$/, "");

                await cloudinary.uploader.destroy(publicId);

            }

        } catch (err) {

            console.error(
                "Failed to delete old avatar:",
                err.message
            );

        }

    }

    user.avatar = req.file.path;

    await user.save();

    req.flash(
        "success",
        "Profile picture updated successfully."
    );

    res.redirect("/users/profile");

});

exports.updateBio = catchAsync(async (req, res) => {

    const bio = (req.body.bio || "").trim();

    const user = await User.findById(req.user._id);

    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/users/profile");
    }

    // Nothing changed
    if (bio === (user.bio || "").trim()) {
        return res.redirect("/users/profile");
    }

    user.bio = bio;

    await user.save();

    req.flash(
        "success",
        bio
            ? "Bio updated successfully."
            : "Bio removed successfully."
    );

    res.redirect("/users/profile");

});