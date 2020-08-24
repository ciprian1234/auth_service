const passport = require("passport");
const jwt = require("jsonwebtoken");
const { createOrUpdateUser, getUser, updateUserRefreshTokenVersion } = require("./db_utils.js");

function addAuthRoutes(app) {
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

  app.get("/auth/google/callback", passport.authenticate("google"), async function (req, res) {
    if (!req.user) res.status(401).json({ error: "AuthError: Failed to login with OAuth2.0" });

    // check if user is already stored in DB
    const db_user = await createOrUpdateUser(req.user);
    const { id, email, refreshTokenVersion } = db_user;

    // create accessToken
    const accessToken = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION / 1000),
    });

    // create refreshToken
    const refreshToken = jwt.sign({ id, email, refreshTokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION / 1000),
    });

    // save refreshToken in user browser as cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) });

    // send userProfile along with accessToken to user
    res.json({ user: db_user, accessToken });
  });

  app.get("/me", isAuthorized, function (req, res) {
    res.send(req.user);
  });

  app.get("/logout", isAuthorized, async function (req, res) {
    // invalidate refreshToken by updating refreshTokenVersion
    await updateUserRefreshTokenVersion(req.user.email);
    // clear refreshToken cookie
    res.clearCookie("refreshToken", { path: "/" });
    res.json({ error: null });
  });

  app.get("/refresh_tokens", async function (req, res) {
    // extract jwt refresh token from user cookie
    try {
      if (!req.cookies.refreshToken) throw new Error("Missing refreshToken cookie");
      const refreshToken = req.cookies.refreshToken;

      // verify refreshToken
      const payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET, "refreshToken");

      // verify if user exists in database
      const user = await getUser(payload.email);
      if (!user) throw new Error("User does not exist");

      // verify refreshTokenVersion from payload agains refreshTokenVersion from user database
      if (payload.refreshTokenVersion !== user.refreshTokenVersion) throw new Error("Invalid refreshTokenVersion");

      // if everything is ok we will reach here, that means refreshToken is valid
      // Generate new accessToken
      const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION / 1000),
      });

      // send new accessToken
      res.send({ accessToken });
      // optionally update also the refresh token so that refreshToken will never expire as long user is active
    } catch (err) {
      res.status(401).json({ error: `AuthError: ${err.message}!` });
    }
  });

  app.post("/register", function (req, res) {
    res.status(501).send({ error: "Not implemented, use registration with oauth instead!" }); // not_implemented
  });

  app.get("/login", function (req, res) {
    res.status(501).send({ error: "Not implemented, use /auth/<provider> instead" }); // not_implemented
  });
}

async function isAuthorized(req, res, next) {
  try {
    // extract jwt refreshToken from user cookie
    if (!req.cookies.refreshToken) throw new Error("Missing refreshToken cookie");

    // extract jwt accessToken from HTTP header
    const authorization = req.headers["authorization"];
    if (!authorization) throw new Error("Missing authorization header");

    // extract accessToken from header
    const accessToken = authorization.split(" ")[1];
    if (!accessToken) throw new Error("Missing accessToken from header");

    // verify tokens
    let accessTokenPayload = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET, "accessToken");
    let refreshTokenPayload = verifyToken(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET, "refreshToken");

    // verify if user exists in database
    const user = await getUser(accessTokenPayload.email); //[THIS PART IS ONLY POSIBLE INSIDE THIS MICROSERVICE]
    if (!user) throw new Error("User does not exist");

    // verify refreshTokenVersion from payload agains refreshTokenVersion from user database
    if (refreshTokenPayload.refreshTokenVersion !== user.refreshTokenVersion) throw new Error("Invalid refreshTokenVersion");

    // if everything is ok we will reach here, that means user is identified and authorized
    req.user = user; // add user to the req object
    next(); // call next middleware
  } catch (err) {
    res.status(401).json({ error: `AuthError: ${err.message}!` });
  }
}

function verifyToken(token, secret, errMsg) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error(`Invalid ${errMsg} (${err.message})`);
  }
}

module.exports = { addAuthRoutes, isAuthorized };
