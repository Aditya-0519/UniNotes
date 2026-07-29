const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const contributionController = require('../controllers/contributionController');
const { upload } = require('../middleware/upload');



router.get('/', contributionController.index);
router.get('/new', isLoggedIn, contributionController.newForm);
router.post('/', isLoggedIn, upload.array('files', 5), contributionController.create);
router.get('/my', isLoggedIn, contributionController.myContributions);
router.get(
    "/bookmarks",
    isLoggedIn,
    contributionController.myBookmarks
);
router.get("/:id/view", isLoggedIn, contributionController.viewPdf);
router.get('/:id', contributionController.show);
router.delete("/:id", isLoggedIn, contributionController.deleteContribution);
router.post(
    "/:id/bookmark",
    isLoggedIn,
    contributionController.toggleBookmark
);

router.post(
    "/:id/like",
    isLoggedIn,
    contributionController.toggleLike
);


router.post(
    "/:id/comments",
    isLoggedIn,
    contributionController.addComment
);


router.delete(
    "/:id/comments/:commentId",
    isLoggedIn,
    contributionController.deleteComment
);


router.patch(
    "/:id/comments/:commentId",
    isLoggedIn,
    contributionController.editComment
);


router.get("/:id/pdf", isLoggedIn, async (req, res) => {
    const contribution = await Contribution.findById(req.params.id);

    if (!contribution || contribution.files.length === 0) {
        req.flash("error", "PDF not found.");
        return res.redirect("/contributions");
    }

    res.render("contributions/pdfViewer", {
        contribution,
        pdfUrl: contribution.files[0].url
    });
});

module.exports = router;