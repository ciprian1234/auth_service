const { randomBytes } = require("crypto");

// DB STUB
const users = [];

module.exports.createOrUpdateUser = function (profile) {
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
};

module.exports.getUser = function (email) {
  return users.find((u) => email == u.email);
};

module.exports.updateUserTokenVersion = function (email) {
  // TODO
};
