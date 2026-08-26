const User = require("../models/user");
const Institution = require("../models/institution");
const catchAsync = require("../utils/catchAsync");
const Contribution = require("../models/contribution");
const InstitutionRequest = require("../models/institutionRequest");
const reputation = require("../utils/reputation");
const notificationService =
    require("../services/notificationService");

exports.dashboard = catchAsync(async (req, res) => {

    const totalUsers = await User.countDocuments();

    const approvedNotes = await Contribution.countDocuments({
        status: "approved"
    });

    const pendingNotes = await Contribution.countDocuments({
        status: "pending"
    });

    const rejectedNotes = await Contribution.countDocuments({
        status: "rejected"
    });

    const totalInstitutions = await Institution.countDocuments();

    res.render("admin/dashboard", {

        totalUsers,
        approvedNotes,
        pendingNotes,
        rejectedNotes,
        totalInstitutions

    });

});

exports.allContributions = catchAsync(async (req, res) => {

    const contributions = await Contribution.find({})
        .populate("contributor", "fullName")
        .populate("institution", "shortName")
        .sort({ createdAt: -1 });

    res.render("admin/contributions", {
        contributions
    });

});

exports.approvedContributions = catchAsync(async (req, res) => {

    const contributions = await Contribution.find({
        status: "approved"
    })
    .populate("contributor", "fullName")
    .populate("institution")
    .sort({ createdAt: -1 });

    res.render("admin/contributions", {
        contributions
    });

});

exports.rejectContribution = catchAsync(async (req, res) => {

    await Contribution.findByIdAndUpdate(
        req.params.id,
        {
            status: "rejected"
        }
    );

    req.flash("success", "Contribution rejected.");

    res.redirect("/admin/contributions");

});


exports.pendingContributions = catchAsync(async (req, res) => {

    const contributions = await Contribution.find({
        status: "pending"
    })
    .populate("contributor", "fullName")
    .populate("institution", "shortName")
    .sort({ createdAt: -1 });

    res.render("admin/contributions", {
        contributions
    });

});


exports.rejectedContributions = catchAsync(async (req, res) => {

    const contributions = await Contribution.find({
        status: "rejected"
    })
    .populate("contributor", "fullName")
    .populate("institution", "shortName")
    .sort({ createdAt: -1 });

    res.render("admin/contributions", {
        contributions
    });

});


exports.deleteContribution = catchAsync(async (req, res) => {

    await Contribution.findByIdAndDelete(
        req.params.id
    );

    req.flash("success", "Contribution deleted.");

    res.redirect("/admin/contributions");

});

exports.approveContribution = catchAsync(async (req, res) => {

    const contribution =
        await Contribution.findById(req.params.id);


    if (!contribution) {

        req.flash(
            "error",
            "Contribution not found."
        );

        return res.redirect(
            "/admin/contributions"
        );

    }


    if (contribution.status !== "approved") {

        contribution.status = "approved";

        await contribution.save();


        await reputation.addReputation(
            contribution.contributor,
            20
        );


        try {

            const result =
                await notificationService
                    .notifyMatchingStudents(
                        contribution
                    );


            console.log(
                `🔔 Contribution notification result: ${result.sentCount} notifications sent to ${result.matchedUsers} matching students.`
            );

        } catch (error) {

            // Notification failure should NOT undo approval
            console.error(
                "❌ Contribution notification error:",
                error
            );

        }

    }


    req.flash(
        "success",
        "Contribution approved."
    );

    res.redirect(
        "/admin/contributions"
    );

});


exports.institutionRequests = catchAsync(async (req, res) => {

    const requests = await InstitutionRequest.find({})
        .sort({ createdAt: -1 });

    res.render("admin/institutionRequests", {
        requests
    });

});

exports.approveInstitutionRequest = catchAsync(async (req, res) => {

    const request = await InstitutionRequest.findById(req.params.id);

    if (!request) {
        req.flash("error", "Request not found.");
        return res.redirect("/admin/institution-requests");
    }

    await Institution.create({

        name: request.name,

        city: request.city,

        state: request.state,

        shortName: "",

        website: ""

    });

    request.status = "approved";

    await request.save();

    req.flash("success", "Institution approved.");

    res.redirect("/admin/institution-requests");

});


exports.rejectInstitutionRequest = catchAsync(async (req, res) => {

    await InstitutionRequest.findByIdAndUpdate(
        req.params.id,
        {
            status: "rejected"
        }
    );

    req.flash("success", "Request rejected.");

    res.redirect("/admin/institution-requests");

});


exports.deleteInstitutionRequest = catchAsync(async (req, res) => {

    await InstitutionRequest.findByIdAndDelete(req.params.id);

    req.flash("success", "Request deleted.");

    res.redirect("/admin/institution-requests");

});

exports.users = catchAsync(async (req, res) => {

    const users = await User.find({})
        .populate("institution", "name shortName")
        .sort({ createdAt: -1 });

    res.render("admin/users", {
        users
    });

});

exports.newInstitutionForm = (req, res) => {

    res.render("admin/newInstitution");

};

exports.createInstitution = catchAsync(async (req, res) => {

    await Institution.create({
        name: req.body.name,
        shortName: req.body.shortName,
        city: req.body.city,
        state: req.body.state,
        isVerified: true
    });

    req.flash("success", "Institution added successfully.");

    res.redirect("/admin");

});

exports.editInstitutionForm = catchAsync(async (req, res) => {

    const institution = await Institution.findById(req.params.id);

    if (!institution) {

        req.flash("error", "Institution not found.");

        return res.redirect("/admin/institutions");

    }

    res.render("admin/editInstitution", {
        institution
    });

});

exports.updateInstitution = catchAsync(async (req, res) => {

    const {
        name,
        shortName,
        city,
        state
    } = req.body;

    await Institution.findByIdAndUpdate(
        req.params.id,
        {
            name,
            shortName,
            city,
            state
        }
    );

    req.flash("success", "Institution updated successfully.");

    res.redirect("/admin/institutions");

});

exports.institutions = catchAsync(async (req, res) => {

    const institutions = await Institution.find({})
        .sort({ name: 1 });

    res.render("admin/institutions", {
        institutions
    });

});