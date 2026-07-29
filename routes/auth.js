const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/register', authController.registerForm);
router.post('/register', authController.register);
router.get('/login', authController.loginForm);
router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: true
    })
);
router.get('/logout', authController.logout);

// Google Login
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);



// Google Callback
router.get(
    "/google/callback",
    (req, res, next) => {

        passport.authenticate(
            "google",
            (err, user, info) => {

                if (err) {
                    return next(err);
                }

                // Existing user
                if (user) {

    return req.logIn(user, err => {

        if (err) return next(err);

        return res.redirect("/");

    });

}

                // New Google user
                if (info && info.message === "NEW_GOOGLE_USER") {

    req.session.googleUser = info.profile;

    return req.session.save(err => {

        if (err) return next(err);

        return res.redirect("/auth/register/google");

    });

}
                req.flash("error", "Google login failed.");

return res.redirect("/auth/login");

            }

        )(req, res, next);

    }
);


router.get(
    "/register/google/admin",
    authController.completeSuperAdminRegistration
);


router.get(
    "/register/google",
    authController.googleRegisterForm
);

router.post(
    "/register/google",
    authController.completeGoogleRegistration
);

module.exports = router;