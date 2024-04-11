const express = require("express");
const router = express.Router();

const stylesController = require("../controllers/stylesController");

router.get("/", stylesController.getStyles);

router.get("/:styleSlug", stylesController.getSingleStyle);

module.exports = router;
