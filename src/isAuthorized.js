const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.resolve(`${__dirname}/..`, ".env") });

function isAuthorized(req, res, next) {
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

    const { id, email } = accessTokenPayload;

    // if everything is ok we will reach here, that means user is identified and authorized
    req.user = { id, email }; // add user to the req object
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

module.exports = { isAuthorized };
