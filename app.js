require('dotenv').config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const { MongoStore } = require("connect-mongo");
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require("method-override");
const multer = require("multer");

const app = express();


// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));


// PDF.js
app.use(
    "/pdfjs",
    express.static(
        path.join(
            __dirname,
            "node_modules",
            "pdfjs-dist",
            "build"
        )
    )
);


// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Passport Config
require('./config/passport')(passport);


// Global Variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Routes
app.use('/auth', require('./routes/auth'));
app.use('/contributions', require('./routes/contributions'));
app.use("/users", require("./routes/users"));
app.use("/institutions", require("./routes/institutions"));
app.use("/institutionRequests", require("./routes/institutionRequests"));
app.use("/admin", require("./routes/admin"));
app.use(
    "/notifications",
    require("./routes/notifications")
);


// Home Route
const contributionController = require("./controllers/contributionController");

app.get("/", contributionController.index);


// Upload Error Handler
app.use((err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {

            req.flash(
                "error",
                "File is too large. Maximum allowed size is 10 MB."
            );

            return res.redirect("/contributions/new");
        }

        req.flash(
            "error",
            "There was a problem uploading your file."
        );

        return res.redirect("/contributions/new");
    }

    if (err.message === "Only PDF files are allowed.") {

        req.flash("error", err.message);

        return res.redirect("/contributions/new");
    }

    next(err);

});


// 404 Handler
app.use((req, res) => {
    res.status(404).render("error", {
        message: "Page Not Found"
    });
});


// General Error Handler
app.use((err, req, res, next) => {

    console.error(err);

    const status = err.status || 500;

    res.status(status).render("error", {
        message: err.message || "Something went wrong"
    });

});


// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});