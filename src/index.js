require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./passport_config");
const { addAuthRoutes } = require("./auth");

const app = express();

// server middleware
app.use(cors({ credentials: true })); // allow cross origin resource sharing
app.use(passport.initialize()); // use passport middleware

// add routes
app.get("/", function (req, res) {
  res.send("ok");
});

// auth routes
addAuthRoutes(app);

app.listen(process.env["PORT"], () =>
  console.log(`Server is listening at: http://localhost:${process.env["PORT"]}/`)
);
