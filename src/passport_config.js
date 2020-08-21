const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// use Google oauth2.0 strategy
module.exports = function passport_config() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        cb(null, { ...profile, accessToken, refreshToken });
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (user, cb) {
    cb(null, user);
  });
};
