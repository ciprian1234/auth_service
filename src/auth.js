const passport = require("passport");

module.exports.addAuthRoutes = function (app) {
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      // login succeded
      res.redirect("/");
    }
  );
};
