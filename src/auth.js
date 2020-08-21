const passport = require("passport");
const jwt = require("jsonwebtoken");
const { createOrUpdateUser, getUser, updateUserTokenVersion } = require("./db_utils.js");

function addAuthRoutes(app) {
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

  app.get("/auth/google/callback", passport.authenticate("google"), function (req, res) {
    if (!req.user) res.status(401).json({ error: "AuthError: Failed to login with OAuth2.0" });

    // check if user is already in DB
    const { email, tokenVersion, name } = createOrUpdateUser(req.user);

    // create accessToken
    const token = jwt.sign({ email, tokenVersion }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });

    // send userProfile along with accessToken to user
    res.json({ user: { email, name }, accessToken: token, error: null });
    // optional feature: create refreshToken
    // optional feature: save refreshToken in user browser as cookie
  });

  app.get("/me", isAuthorized, function (req, res) {
    res.send(req.user);
  });

  app.get("/logout", isAuthorized, function (req, res) {
    // invalidate access and refresh token
    updateUserTokenVersion();
    res.json({ error: null });
  });

  app.get("/refresh_tokens", function (req, res) {
    // generate new tokens based on provided refreshToken from cookie
    res.status(501).send({ error: "Not using refresh token at the moment" });
  });

  app.post("/register", function (req, res) {
    res.status(501).send({ error: "Not implemented, use registration with oauth instead!" }); // not_implemented
  });

  app.get("/login", function (req, res) {
    res.status(501).send({ error: "Not implemented, use /auth/<provider> instead" }); // not_implemented
  });
}

function isAuthorized(req, res, next) {
  try {
    // extract jwt access token from HTTP header
    const authorization = req.headers["authorization"];
    if (!authorization) throw new Error("Missing authorization header");

    // extract accessToken from header
    const token = authorization.split(" ")[1];
    if (!token) throw new Error("Missing accessToken from header");

    // verify jwt
    let payload = null;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new Error("Invalid JWT");
    }

    // verify if user was found in database
    const user = getUser(payload.email);
    if (!user) throw new Error("User does not exist");

    // verify tokenVersion from payload agains tokenVersion from user database
    if (payload.tokenVersion !== user.tokenVersion) throw new Error("Invalid tokenVersion");

    // if everything is ok we will reach here, that means user is identified and authorized
    req.user = user; // add user to the req object
    next(); // call next middleware
  } catch (err) {
    res.status(401).json({ error: `AuthError: ${err.message}!` });
  }
}

module.exports = { addAuthRoutes, isAuthorized };
