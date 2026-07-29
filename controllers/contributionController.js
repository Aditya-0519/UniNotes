const Contribution = require("../models/contribution");
const Institution = require("../models/institution");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/comment");
const reputation = require("../utils/reputation");


// ===============================
// Home + Search
// ===============================
exports.index = catchAsync(async (req, res) => {

    const search = (req.query.q || "").trim();

    let query = {
        status: "approved",
        visibility: "public"
    };

    if (search) {
        query.$text = {
            $search: search
        };
    }

    const contributions = await Contribution.find(query)
        .select(
            search
                ? { score: { $meta: "textScore" } }
                : {}
        )
        .populate("contributor", "fullName reputation contributionCount")
        .populate("institution", "name shortName city state isVerified")
        .sort(
            search
                ? { score: { $meta: "textScore" } }
                : { createdAt: -1 }
        )
        .limit(20);

    res.render("contributions/index", {
        contributions,
        search
    });

});



// ===============================
// Upload Form
// ===============================
exports.newForm = catchAsync(async (req, res) => {

    const institutions = await Institution.find();

    res.render("contributions/new", {
        institutions
    });

});



// ===============================
// Create Contribution
// ===============================
exports.create = catchAsync(async (req, res) => {

    const {
        title,
        description,
        semester,
        courseCode,
        subject,
        branch,
        tags,
        visibility
    } = req.body;

    const files = req.files.map(file => ({
        url: file.path,
        fileName: file.originalname,
        fileType: file.mimetype.split("/")[1] || "pdf",
        size: file.size
    }));

    await Contribution.create({

        contributor: req.user._id,
        institution: req.user.institution,

        title,
        description,
        subject,
        branch,
        semester,
        courseCode,

        files,

        tags: tags
            ? tags.split(",").map(tag => tag.trim().toLowerCase())
            : [],

        visibility: visibility || "public",

        status: "pending"

    });

    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            contributionCount: 1
        }
    });

    req.flash(
    "success",
    "Notes uploaded successfully. It is now waiting for admin approval."
);

    res.redirect("/contributions/my");

});



// ===============================
// Show Single Contribution
// ===============================
exports.show = catchAsync(async (req, res) => {

    const contribution = await Contribution.findById(req.params.id)
    .populate("contributor", "fullName reputation contributionCount")
    .populate("institution", "name shortName city state isVerified")
    .populate({
        path: "comments",
        populate: {
            path: "author",
            select: "fullName"
        }
    });

    if (!contribution) {

        req.flash("error", "Contribution not found.");

        return res.redirect("/contributions");

    }

    const viewedNotes = req.session.viewedNotes || [];

if (!viewedNotes.includes(contribution._id.toString())) {

    contribution.stats.views++;

    await contribution.save();

    viewedNotes.push(contribution._id.toString());

    req.session.viewedNotes = viewedNotes;

}

    const relatedNotes = await Contribution.find({

        _id: {
            $ne: contribution._id
        },

        subject: contribution.subject,

        status: "approved",

        visibility: "public"

    })
        .populate("contributor", "fullName")
        .limit(4);

        let isBookmarked = false;

if (req.user) {

    const user = await User.findById(req.user._id);

    isBookmarked = user.bookmarks.some(bookmark =>
        bookmark.toString() === contribution._id.toString()
    );

}

    res.render("contributions/show", {

    contribution,
    relatedNotes,
    isBookmarked

});

});



// ===============================
// My Contributions
// ===============================
exports.myContributions = catchAsync(async (req, res) => {

    const contributions = await Contribution.find({

        contributor: req.user._id

    })
        .populate("institution", "name shortName city state")
        .sort({
            createdAt: -1
        });

    res.render("contributions/my", {

        contributions

    });

});



// ===============================
// Read PDF
// ===============================
exports.viewPdf = catchAsync(async (req, res) => {

    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {

        req.flash("error", "Contribution not found.");

        return res.redirect("/contributions");

    }

    res.render("contributions/viewPdf", {

        contribution

    });

});



// ===============================
// Delete Contribution
// ===============================
exports.deleteContribution = catchAsync(async (req, res) => {

    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {

        req.flash("error", "Contribution not found.");

        return res.redirect("/contributions/my");

    }

    if (
        contribution.contributor.toString() !== req.user._id.toString()
    ) {

        req.flash("error", "You are not allowed to delete this note.");

        return res.redirect("/contributions/my");

    }

    await Contribution.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user._id, {

        $inc: {

            contributionCount: -1

        }

    });

    req.flash("success", "Contribution deleted successfully.");

    res.redirect("/contributions/my");

});

exports.toggleBookmark = catchAsync(async (req, res) => {

    const user = await User.findById(req.user._id);

    const contributionId = req.params.id;

    const alreadyBookmarked = user.bookmarks.includes(contributionId);

    if (alreadyBookmarked) {

        user.bookmarks.pull(contributionId);

        req.flash("success", "Bookmark removed.");

    } else {

        user.bookmarks.push(contributionId);

        req.flash("success", "Added to bookmarks.");

    }

    await user.save();

    res.redirect("/contributions/" + contributionId);

});

exports.myBookmarks = catchAsync(async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate({
            path: "bookmarks",
            populate: [
                {
                    path: "contributor",
                    select: "fullName"
                },
                {
                    path: "institution",
                    select: "name shortName"
                }
            ]
        });

    res.render("contributions/bookmarks", {
        bookmarks: user.bookmarks
    });

});

exports.toggleLike = catchAsync(async (req, res) => {

    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {

        req.flash("error", "Contribution not found.");

        return res.redirect("/contributions");

    }

    const alreadyLiked = contribution.likes.some(id =>
        id.equals(req.user._id)
    );

    if (alreadyLiked) {

        contribution.likes.pull(req.user._id);

        await reputation.removeReputation(
            contribution.contributor,
            5
        );

        req.flash("success", "Like removed.");

    } else {

        contribution.likes.push(req.user._id);

        await reputation.addReputation(
            contribution.contributor,
            5
        );

        req.flash("success", "You liked this note.");

    }

    await contribution.save();

    res.redirect("/contributions/" + contribution._id);

});

exports.addComment = catchAsync(async (req, res) => {

    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
        req.flash("error", "Contribution not found.");
        return res.redirect("/contributions");
    }

    const comment = await Comment.create({

        text: req.body.text,

        author: req.user._id,

        contribution: contribution._id

    });

    contribution.comments.push(comment._id);

    await contribution.save();

    req.flash("success", "Comment added.");

    res.redirect("/contributions/" + contribution._id);

});


exports.deleteComment = catchAsync(async (req, res) => {

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        req.flash("error", "Comment not found.");
        return res.redirect("/contributions/" + req.params.id);
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        req.flash("error", "You cannot delete this comment.");
        return res.redirect("/contributions/" + req.params.id);
    }

    await Contribution.findByIdAndUpdate(req.params.id, {
        $pull: {
            comments: comment._id
        }
    });

    await Comment.findByIdAndDelete(comment._id);

    req.flash("success", "Comment deleted.");

    res.redirect("/contributions/" + req.params.id);

});

exports.editComment = catchAsync(async (req, res) => {

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {

        req.flash("error", "Comment not found.");

        return res.redirect("/contributions/" + req.params.id);

    }

    if (comment.author.toString() !== req.user._id.toString()) {

        req.flash("error", "You can only edit your own comments.");

        return res.redirect("/contributions/" + req.params.id);

    }

    comment.text = req.body.text;

    await comment.save();

    req.flash("success", "Comment updated.");

    res.redirect("/contributions/" + req.params.id);

});