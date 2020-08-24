const { runAuthService } = require("./src/main");
const { isAuthorized } = require("./src/auth");

module.exports = { runAuthService, isAuthorized };
