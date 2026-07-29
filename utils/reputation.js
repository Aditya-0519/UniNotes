const User = require("../models/user");

exports.addReputation = async (userId, points) => {

    await User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                reputation: points
            }
        }
    );

};

exports.removeReputation = async (userId, points) => {

    await User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                reputation: -points
            }
        }
    );

};

exports.getBadge = function (points) {

    if (points >= 1500) return "👑 Campus Legend";

    if (points >= 800) return "🥇 Gold Contributor";

    if (points >= 400) return "🥈 Silver Contributor";

    if (points >= 150) return "🥉 Bronze Contributor";

    if (points >= 50) return "📘 Contributor";

    return "🌱 Beginner";

};