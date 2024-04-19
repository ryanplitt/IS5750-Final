const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/styles", apiController.getStyles);

module.exports = router;
