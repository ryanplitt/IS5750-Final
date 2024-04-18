const User = require("../models/User");

module.exports = (req, res, next) => {
	if (res.locals.user.isAdmin) {
		next();
	} else {
		const error = new Error("Unauthorized");
		error.statusCode = 403;
		next(error);
	}
};
