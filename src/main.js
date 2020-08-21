require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passport_config = require("./passport_config");
const { addAuthRoutes } = require("./auth");

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

  app.listen(process.env.PORT, () => console.log(`Server is listening at: http://localhost:${process.env.PORT}/`));
}

main();
