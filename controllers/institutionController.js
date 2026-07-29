const Institution = require("../models/institution");
const Contribution = require("../models/contribution");
const InstitutionRequest = require("../models/institutionRequest");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

exports.show = catchAsync(async (req,res)=>{
    try {

        const institution = await Institution.findById(req.params.id);

        if (!institution) {
            req.flash("error", "Institution not found");
            return res.redirect("/");
        }

        const contributions = await Contribution.find({
            institution: institution._id,
            status: "approved"
        })
            .populate("contributor", "fullName reputation")   // ✅
            .sort({ createdAt: -1 });

        const contributorCount = await User.countDocuments({
            institution: institution._id
        });

        res.render("institutions/show", {
            institution,
            contributions,
            contributorCount
        });

    } catch (err) {
        res.redirect("/");
    }
});

exports.requestForm = (req, res) => {

    res.render("institutions/request");

};

exports.createRequest = catchAsync(async (req, res) => {

    const {
        name,
        city,
        state,
        message
    } = req.body;

    await InstitutionRequest.create({

        requestedBy: req.user._id,

        name,

        city,

        state,

        message

    });

    req.flash(
        "success",
        "Institution request submitted successfully."
    );

    res.redirect("/register");

});