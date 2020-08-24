const { User } = require("./db");
const { randomBytes } = require("crypto");

module.exports = {
  getUser,
  createOrUpdateUser,
  updateUserRefreshTokenVersion,
};

async function createOrUpdateUser(profile) {
  let user = await getUser(profile._json.email);

  // create new profile data
  const newProfile = createUserProfileAdapter(profile);

  // check if user already exists in DB
  if (!user) {
    user = await User.create(newProfile); // add user to DB
  } else {
    // update userProfile from google profile and also the tokenVersion
    await User.update(newProfile, { where: { email: newProfile.email } });
  }

  return getUser(newProfile.email);
}

// get user by email from database
async function getUser(email) {
  return await User.findOne({ where: { email } });
}

// update user tokenVersion from database
async function updateUserRefreshTokenVersion(email) {
  const refreshTokenVersion = randomBytes(32).toString("base64");
  await User.update({ refreshTokenVersion }, { where: { email } });
}

// user adapter from Provider to User model from database
function createUserProfileAdapter(profile) {
  return {
    providerID: profile.id,
    providerAccessToken: profile.accessToken,
    refreshTokenVersion: randomBytes(32).toString("base64"),
    // role: has already a default value of 'user'
    email: profile._json.email,
    givenName: profile._json.given_name,
    familyName: profile._json.family_name,
    picture: profile._json.picture,
  };
}
