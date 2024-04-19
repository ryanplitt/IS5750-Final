const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const isAdmin = require("../middleware/isAdmin");

// Define route handlers
router.get("/", homeController.getHome);

router.get("/about", homeController.getAbout);

router.get("/user-access", isAdmin, homeController.getUserAccess);

module.exports = router;
