const passport = require("passport");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { exception } = require("console");

const users = [];

module.exports.getUsers = () => users;

module.exports.addAuthRoutes = function (app) {
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

  app.get("/auth/google/callback", passport.authenticate("google"), function (req, res) {
    if (!req.user) res.status(401).json({ error: "AuthError: Failed to login with OAuth2.0" });
    else {
      // check if user is already in DB
      const { email, tokenVersion } = checkUser(req.user);

      // create accessToken
      const token = jwt.sign({ email, tokenVersion }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      });

      // send accessToken to user
      res.json({ accessToken: token, error: null });
    }
  });

  app.get("/logout", function (req, res) {
    // invalidate access and refresh token
    /* TODO */
  });

  app.get("/refresh_tokens", function (req, res) {
    // generate new access token and refresh token for user
    /* TODO */
  });
};

module.exports.isAuthorized = function (req, res, next) {
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

    // TODO: verify if user was found in database
    const user = users.find((u) => payload.email == u.email);
    if (!user) throw new Error("User does not exist");

    // verify tokenVersion from payload agains tokenVersion from user database
    if (payload.tokenVersion !== user.tokenVersion) throw new Error("Invalid tokenVersion");

    // if everything is ok we reach here
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ error: `AuthError: ${err.message}!`, success: false });
  }
};

function checkUser(profile) {
  // extract email from userProfile
  const email = profile._json.email;
  const accessTokenProvider = profile.accessToken;
  const name = profile.name;
  const tokenVersion = randomBytes(32).toString("base64");

  // check if user already exists in DB
  if (users.filter((user) => user.email === email).length > 0) {
  } else {
    users.push({ email, name, accessTokenProvider, tokenVersion });
  }

  return users[users.length - 1];
}
