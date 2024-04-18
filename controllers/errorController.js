exports.get404 = (req, res, next) => {
	res.render("error", {
		pageTitle: "Not Found",
		path: req.url,
		error: "Oops. Sorry this page wasn't found",
	});
};

exports.getError = (err, req, res, next) => {
	console.log(err);
	if (err.statusCode === 403) {
		get403(req, res);
		return;
	}
	res.render("error", {
		pageTitle: "Server Error",
		path: req.url,
		error: "Oops. Something went wrong. Please try again later.",
	});
};

const get403 = (req, res) => {
	res.render("error", {
		pageTitle: "Unauthorized",
		path: req.url,
		error: "Oops. You are not authorized to view this page.",
	});
};
