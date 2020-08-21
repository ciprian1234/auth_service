const { runAuthService } = require("./main");
const { isAuthorized } = require("./auth");

runAuthService(process.env.PORT);

module.exports = { runAuthService, isAuthorized };
