module.exports = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.flash("error", "Please login first.");
        return res.redirect("/login");
    }

    if (
        req.user.role !== "moderator" &&
        req.user.role !== "admin"
    ) {
        req.flash("error", "Access denied.");
        return res.redirect("/");
    }

    next();

};