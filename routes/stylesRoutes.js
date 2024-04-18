const express = require("express");
const router = express.Router();

const stylesController = require("../controllers/stylesController");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", stylesController.getStyles);

router.get("/favorite", isAuth, stylesController.getFavoriteStyles);

router.get("/new", isAdmin, stylesController.getNewStyle);

router.post("/new", isAdmin, stylesController.postNewStyle);

router.post("/:styleSlug/favorite", isAuth, stylesController.toggleFavorite);

router.get("/:styleSlug", stylesController.getSingleStyle);

module.exports = router;
