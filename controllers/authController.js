exports.getLogin = (req, res) => {
	res.render("auth/login", { pageTitle: "Login", path: req.baseUrl });
};

exports.postLogin = (req, res) => {
	res.redirect("/");
};

exports.getSignup = (req, res) => {
	res.render("auth/signup", { pageTitle: "Signup", path: req.baseUrl });
};

exports.postSignup = (req, res) => {
	res.redirect("/");
};

exports.getLogout = (req, res) => {
	res.redirect("/");
};
