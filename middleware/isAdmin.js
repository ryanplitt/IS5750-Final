const User = require("../models/User");

module.exports = (req, res, next) => {
	const user = User.hydrate(res.locals.user);
	if (user.isAdmin) {
		next();
	} else {
		const error = new Error("Unauthorized");
		error.statusCode = 403;
		next(error);
	}
};
