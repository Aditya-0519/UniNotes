function getBadge(reputation) {

    if (reputation >= 500)
        return "👑 UniNotes Legend";

    if (reputation >= 200)
        return "🏆 Elite Contributor";

    if (reputation >= 100)
        return "🏅 Top Contributor";

    if (reputation >= 50)
        return "⭐ Rising Star";

    if (reputation >= 20)
        return "📘 Contributor";

    return "🌱 Beginner";
}

module.exports = {
    getBadge
};