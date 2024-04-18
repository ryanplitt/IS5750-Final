const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");
const isAdmin = require("../middleware/isAdmin");

router.get("/new", contactController.getContact);

router.post("/create", contactController.createContact);

router.post("/:id/update", isAdmin, contactController.editContact);
router.get("/:id/edit", isAdmin, contactController.getEditContact);

router.get("/", isAdmin, contactController.getContactList);

module.exports = router;
