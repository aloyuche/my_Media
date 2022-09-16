const express = require("express");
const router = express.Router();
const authControl = require("../controller/authController");

// router.get("/", authControl.getAllUsers); // this is to get allUsers in json
router.get("/signup", authControl.signup_get);
router.get("/login", authControl.login_get);
router.post("/signup", authControl.signup_post);
router.post("/login", authControl.login_post);
router.get("/logout", authControl.logout_get);
router.post("/api", authControl.create);

// router.get("/logout", authControl.logout_get);

module.exports = router;
