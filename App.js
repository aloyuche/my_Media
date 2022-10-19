require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const cookieParse = require("cookie-parser");
const { requireAuth } = require("./middleware/authMiddleware");
const { getAllUsers, create, findOne } = require("./controller/authController");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
// const paginate = require('express-paginate')
const app = express();

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParse());
app.use(passport.initialize());
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
// app.use(paginate.middleware(process.env.LIMIT, process.env.MAX_LIMIT))

// view engine
app.set("view engine", "ejs");

// Database
mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log("Connected to mongoDB Successfully"))
  .catch((err) => console.log(err));

// ROUTES
app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/home", requireAuth, (req, res) => {
  res.render("home");
});

app.get("/christian", (req, res) => {
  res.render("christian");
});

app.get("/hip", (req, res) => {
  res.render("hip");
});

app.get("/afro", (req, res) => {
  res.render("afro");
});
app.get("/raggae", (req, res) => {
  res.render("raggae");
});

app.get("/protPage", requireAuth, (req, res) => {
  res.render("protPage");
});
app.use(authRoute);

// Cookies
app.get("/set_cookies", (req, res) => {
  res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: false,
  });

  res.send("You got the cookies");
});

app.get("/read_cookies", (req, res) => {
  const cookies = req.cookies;

  console.log(cookies);
  res.json(cookies);
});

// API JSON
app.get("/api", async (req, res) => {
  const allUsers = await getAllUsers();
  res.json(allUsers);
});

app.post("/api", async (req, res) => {
  const { name, username, email, dept, password } = req.body;
  const newUser = await create({ name, username, email, dept, password });
  res.json(newUser);
});

app.get("/api/:id", async (req, res) => {
  const getSingleUser = await findOne();
  res.json(getSingleUser);
});

app.listen(
  process.env.PORT,
  console.log(`Server is on port ${process.env.PORT}`)
);
