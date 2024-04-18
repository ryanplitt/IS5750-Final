module.exports = (req, res, next) => {
	if (res.locals.user && res.locals.user.role === "admin") {
		next();
	} else {
		const error = new Error("Unauthorized");
		error.statusCode = 403;
		next(error);
	}
};
