require("dotenv").config();
const express = require("express");

const app = express();

app.get("/", function (req, res) {
  res.send("ok");
});

app.listen(process.env["PORT"], () =>
  console.log(`Server is listening at: http://localhost:${process.env["PORT"]}/`)
);
