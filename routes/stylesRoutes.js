const express = require("express");
const router = express.Router();

const stylesController = require("../controllers/stylesController");

router.get("/", stylesController.getStyles);

router.get("/favorite", stylesController.getFavoriteStyles);

router.post("/:styleSlug/favorite", stylesController.toggleFavorite); // TODO: Make this authenticated

router.get("/:styleSlug", stylesController.getSingleStyle);

module.exports = router;
