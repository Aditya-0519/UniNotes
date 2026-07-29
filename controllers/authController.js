const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Institution = require('../models/institution');

exports.registerForm = async (req, res) => {
  const institutions = await Institution.find({});
  res.render('auth/register', { institutions });
};

exports.register = async (req, res, next) => {
  const {
  email,
  password,
  fullName,
  institutionId,
  branch,
  semester
} = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    googleId: null,
    institution: institutionId,
    branch,
    semester: Number(semester)
});

req.login(user, (err) => {
  if (err) {
    return next(err);
  }

  req.flash('success', 'Welcome to UniNotes!');
  res.redirect('/auth');
});
 } catch (err) {

    req.flash("error", err.message);

    res.redirect("/register");
}
};

exports.loginForm = (req, res) => res.render('auth/login');


exports.logout = (req, res, next) => {

    req.logout(err => {

        if (err) return next(err);

        req.session.destroy(err => {

            if (err) return next(err);

            res.clearCookie("connect.sid");

            return res.redirect("/");

        });

    });

};

exports.googleSuccess = async (req, res) => {

    if (req.user.isNewGoogleUser) {

        req.session.googleUser = req.user;

        return res.redirect("/register/google");

    }

    req.flash("success", "Welcome back!");

    res.redirect("/");

};

exports.googleRegisterForm = async (req, res) => {

    if (!req.session.googleUser) {

        req.flash("error", "Please continue with Google first.");

        return res.redirect("/auth/login");

    }

    const institutions = await Institution.find({});

    res.render("auth/googleRegister", {
        googleUser: req.session.googleUser,
        institutions
    });

};

exports.completeGoogleRegistration = async (req, res, next) => {

    try {

        if (!req.session.googleUser) {

            req.flash("error", "Google session expired.");

            return res.redirect("/auth/login");

        }

        const googleUser = req.session.googleUser;

        // Check if someone registered while this session was open
        const existingUser = await User.findOne({
            email: googleUser.email
        });

        if (existingUser) {

            req.session.googleUser = null;

            req.login(existingUser, err => {

                if (err) return next(err);

                req.flash(
                    "success",
                    "Welcome back!"
                );

                return res.redirect("/");

            });

            return;

        }

       const user = await User.create({

    fullName: googleUser.fullName,

    email: googleUser.email,

    googleId: googleUser.googleId,

    password: null,

    institution: req.body.institutionId,

    branch: req.body.branch,

    semester: Number(req.body.semester),

    role:
        googleUser.email === process.env.SUPER_ADMIN_EMAIL
            ? "admin"
            : "student"

});

        req.session.googleUser = null;

        req.login(user, err => {

            if (err) return next(err);

            req.flash(
                "success",
                "Welcome to UniNotes!"
            );

            res.redirect("/");

        });

    }

    catch (err) {

        req.flash(
            "error",
            err.message
        );

        res.redirect("/auth/register/google");

    }

};