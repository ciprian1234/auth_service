require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// server middleware
app.use(cors({ credentials: true })); // allow cross origin resource sharing

app.get("/", function (req, res) {
  res.send("ok");
});

app.listen(process.env["PORT"], () =>
  console.log(`Server is listening at: http://localhost:${process.env["PORT"]}/`)
);
