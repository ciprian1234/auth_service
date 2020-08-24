const path = require("path");
require("dotenv").config({ path: path.resolve(`${__dirname}/..`, ".env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const passport_config = require("./passport_config");
const { addAuthRoutes } = require("./auth");
const { sequelize } = require("./db");

async function runAuthService(PORT) {
  // create app instance
  const app = express();
  // config passport
  passport_config();

  // server middleware
  app.use(cors({ credentials: true })); // allow cross origin resource sharing
  app.use(cookieParser());
  app.use(passport.initialize()); // use passport middleware

  // add auth routes
  addAuthRoutes(app);

  // connect to db
  await sequelize.authenticate();
  console.log("Connection to DB has been established successfully.");
  // await sequelize.sync({ force: true });
  await sequelize.sync();
  // sync db to sequelize modeles, (re)create all modeles

  app.listen(PORT, () => console.log(`Server is listening at: http://localhost:${PORT}/`));
}

module.exports = { runAuthService };
