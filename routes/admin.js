const express = require("express");
const router = express.Router();

const isAdmin = require("../middleware/isAdmin");
const isLoggedIn = require("../middleware/isLoggedIn");
const adminController = require("../controllers/adminController");

router.get("/", isLoggedIn, isAdmin, adminController.dashboard);
router.get("/institution-requests",isLoggedIn,isAdmin,adminController.institutionRequests);

router.get("/contributions", isLoggedIn, isAdmin, adminController.allContributions);

router.get(
    "/contributions/approved",
    isLoggedIn,
    isAdmin,
    adminController.approvedContributions
);

router.get(
    "/contributions/pending",
    isLoggedIn,
    isAdmin,
    adminController.pendingContributions
);

router.get(
    "/contributions/rejected",
    isLoggedIn,
    isAdmin,
    adminController.rejectedContributions
);

router.get(
    "/users",
    isLoggedIn,
    isAdmin,
    adminController.users
);

router.patch("/contributions/:id/approve", isLoggedIn, isAdmin, adminController.approveContribution);

router.patch("/contributions/:id/reject", isLoggedIn, isAdmin, adminController.rejectContribution);

router.delete("/contributions/:id", isLoggedIn, isAdmin, adminController.deleteContribution);

router.patch(
"/institution-requests/:id/approve",
isLoggedIn,
isAdmin,
adminController.approveInstitutionRequest
);

router.patch(
"/institution-requests/:id/reject",
isLoggedIn,
isAdmin,
adminController.rejectInstitutionRequest
);

router.delete(
"/institution-requests/:id",
isLoggedIn,
isAdmin,
adminController.deleteInstitutionRequest
);

router.get(
    "/institutions",
    isLoggedIn,
    isAdmin,
    adminController.institutions
);

router.get(
    "/institutions/new",
    isAdmin,
    adminController.newInstitutionForm
);

router.post(
    "/institutions",
    isAdmin,
    adminController.createInstitution
);


router.get(
    "/institutions/:id/edit",
    isLoggedIn,
    isAdmin,
    adminController.editInstitutionForm
);

router.patch(
    "/institutions/:id",
    isLoggedIn,
    isAdmin,
    adminController.updateInstitution
);

router.get(
    "/institutions",
    isLoggedIn,
    isAdmin,
    adminController.institutions
);

module.exports = router;