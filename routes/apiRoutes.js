const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/styles", apiController.verifyToken, apiController.getStyles);
router.get("/token", apiController.getToken);

module.exports = router;
