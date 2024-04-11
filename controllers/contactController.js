const ContactRequest = require("../models/ContactRequest");
const { Op } = require("sequelize");

exports.getContact = (req, res, next) => {
  res.render("contact", { pageTitle: "Contact", path: "/contacts/new" });
};

exports.getContactList = async (req, res, next) => {
  try {
    const contacts = await ContactRequest.findAll({
      where: {
        response: null,
      },
    });
    res.render("contact-list", {
      pageTitle: "Contact List",
      contacts,
      path: "/contacts",
    });
  } catch (e) {
    console.log("error: ", e);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const { name, email, message, phone, address } = req.body;
    await ContactRequest.create({
      name,
      email,
      message,
      phone,
      address,
    });
    res.render("thanks", { pageTitle: "Thank You!", path: "/contacts/new" });
  } catch (e) {
    console.log("error: ", e);
  }
};

exports.getEditContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await ContactRequest.findByPk(id);
    res.render("contact-respond", {
      pageTitle: `${contact.name} - edit`,
      contact,
      path: req.baseUrl,
    });
  } catch (e) {
    console.log("error: ", e);
  }
};

exports.editContact = async (req, res, next) => {
  const { id } = req.params;
  const { response } = req.body;
  try {
    const contact = await ContactRequest.findByPk(id);
    contact.response = response;
    contact.dateResponded = new Date();
    await contact.save();
    res.render("contact-respond", {
      pageTitle: `${contact.name} - edit`,
      contact,
      path: req.baseUrl,
    });
  } catch (e) {
    console.log("error: ", e);
  }
};

