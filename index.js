require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

app.use(passport.initialize());

mongoose
  .connect("mongodb://localhost:27017/auth01")
  .then(() => console.log("Server connected successfully"))
  .catch((err) => console.log(err));

app.listen(
  process.env.PORT,
  console.log(`Server is running on port ${process.env.PORT}`)
);
