const authModel = require("../model/authModel");
const jwt = require("jsonwebtoken");

// Error Handling
const ErrorHandler = (err) => {
  console.log(err.message, err.code);
  let errors = { username: "", password: "" };

  if (err.message === "Invalid password, must be more than 6 character") {
    errors.password = "The Password isnot correct";
  }
  //Duplicating Error
  if (err.code === 11000) {
    errors.username = "The Username already exist please log in";
    return errors;
  }

  // Validating Errors
  if (err.message.includes("userauth validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      // This will specify the exact error
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// JWT TOKEN CREATION
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "nwa Biafra secret", {
    expiresIn: maxAge,
  });
};

// To get allUsers
module.exports.getAllUsers = async (req, res) => {
  const allUsers = await authModel.find();
  return allUsers;
};

// Find One User
module.exports.findOne = async (req, res) => {
  const User = await authModel.findOne();
  return User;
};

//
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login", { message: req.flash() });
};
//Create New User
module.exports.signup_post = async (req, res) => {
  const { name, username, email, dept, password } = req.body;

  try {
    const User = await authModel.create({
      name,
      username,
      email,
      dept,
      password,
    });
    const token = createToken(User._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json({ User });
  } catch (err) {
    const errors = ErrorHandler(err);
    res.status(400).json({ errors });
  }
};

// Sign in
module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authModel.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
    // req.flash("message", "Successfully logged in");
    // res.redirect("/");
  } catch (error) {
    const errors = ErrorHandler(error);
    // req.flash("Invalide user credentials");
    // res.redirect("/login");
    res.status(400).json({ errors });
  }
};

// Log out
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
