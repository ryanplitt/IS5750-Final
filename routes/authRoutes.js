const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/login", authController.getLogin);

router.post("/login", authController.authUser, authController.loginWebApp);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/logout", authController.getLogout);

module.exports = router;
