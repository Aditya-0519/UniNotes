const User = require("../models/user");
const Contribution = require("../models/contribution");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const reputation = require("../utils/reputation");
const badges = require("../utils/badges");

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
    badge: reputation.getBadge(user.reputation)
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
    badge: badges.getBadge(user.reputation)
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