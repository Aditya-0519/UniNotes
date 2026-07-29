const InstitutionRequest = require("../models/institutionRequest");
const Institution = require("../models/institution");   // <-- ADD THIS
const catchAsync = require("../utils/catchAsync");

exports.newForm = (req, res) => {
    res.render("institutionRequests/new");
};

exports.createRequest = catchAsync(async (req, res) => {

    const { name, city, state, message } = req.body;

    // -------------------------------
    // Check if institution already exists
    // -------------------------------
    const existingInstitution = await Institution.findOne({
        name: new RegExp(`^${name}$`, "i")
    });

    if (existingInstitution) {
        req.flash("error", "This institution already exists.");
        return res.redirect("/institutionRequests/new");
    }

    // -------------------------------
    // Check if request already exists
    // -------------------------------
    const existingRequest = await InstitutionRequest.findOne({
        name: new RegExp(`^${name}$`, "i"),
        status: "pending"
    });

    if (existingRequest) {
        req.flash("error", "Someone has already requested this institution.");
        return res.redirect("/institutionRequests/new");
    }

    // -------------------------------
    // Create request
    // -------------------------------
    await InstitutionRequest.create({
    requestedBy: req.user ? req.user._id : null,
    name,
    city,
    state,
    message
});

    req.flash("success", "Institution request submitted successfully. The Amin will review your college shortly");

    res.redirect("/auth/register");

});