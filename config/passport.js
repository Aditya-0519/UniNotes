const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'No user found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));


  passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
       async (accessToken, refreshToken, profile, done) => {

    try {

        // 1. Existing Google account
        let user = await User.findOne({
            googleId: profile.id
        });

        if (user) {
            return done(null, user);
        }

        // Existing email account
user = await User.findOne({
    email: profile.emails[0].value
});

if (user) {

    if (!user.googleId) {
        user.googleId = profile.id;
    }

    // Automatically promote the owner account
    if (user.email === process.env.SUPER_ADMIN_EMAIL) {
        user.role = "admin";
    }

    await user.save();

    return done(null, user);

}

        // 3. Brand-new Google user
        // 3. Brand-new Google user
return done(null, false, {
    message: "NEW_GOOGLE_USER",
    profile: {
        googleId: profile.id,
        fullName: profile.displayName,
        email: profile.emails[0].value
    }
});

    } catch (err) {

        return done(err);

    }

}
    )
);

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};