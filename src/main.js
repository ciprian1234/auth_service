require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passport_config = require("./passport_config");
const { addAuthRoutes } = require("./auth");
const { sequelize } = require("./db");

async function main() {
  // create app instance
  const app = express();
  // config passport
  passport_config();

  // server middleware
  app.use(cors({ credentials: true })); // allow cross origin resource sharing
  app.use(passport.initialize()); // use passport middleware

  // add auth routes
  addAuthRoutes(app);

  // connect to db
  await sequelize.authenticate();
  console.log("Connection to DB has been established successfully.");
  //await sequelize.sync({ force: true });
  await sequelize.sync();
  // sync db to sequelize modeles, (re)create all modeles

  app.listen(process.env.PORT, () => console.log(`Server is listening at: http://localhost:${process.env.PORT}/`));
}

main();
