const User = require("../models/User");

exports.getHome = (req, res, next) => {
	res.render("index", { pageTitle: "Home", path: req.path });
};

exports.getAbout = (req, res, next) => {
	res.render("about", { pageTitle: "About", path: req.path });
};

exports.getUserAccess = async (req, res, next) => {
	const users = await User.find({ role: { $ne: "owner" } }).exec();
	res.render("user-access", { pageTitle: "User Access", path: req.path, users: users });
};
