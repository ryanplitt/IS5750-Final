const User = require("../models/user");

exports.getLogin = (req, res) => {
	res.render("auth/login", { pageTitle: "Login", path: req.baseUrl });
};

exports.postLogin = (req, res) => {
	authUser(req, res, loginWebApp);
};

exports.getSignup = (req, res) => {
	res.render("auth/signup", { pageTitle: "Signup", path: req.baseUrl, useMockData: true });
};

exports.authUser = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			throw new Error("Invalid Credentials");
		}
		const passwordsMatch = await user.validatePassword(password);
		if (!passwordsMatch) {
			throw new Error("Invalid Credentials");
		}
		res.locals.user = user;
		res.locals.passwordsMatch = passwordsMatch;

		next();
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.loginWebApp = async (req, res, next) => {
	if (res.locals && res.locals.user && res.locals.passwordsMatch) {
		req.session.isLoggedIn = true;
		req.session.user = res.locals.user;
		console.log(
			"Setting session, user: ",
			req.session.user,
			"isLoggedIn: ",
			req.session.isLoggedIn
		);
		try {
			await req.session.save();
			res.redirect("/");
			return;
		} catch (err) {
			console.log(err);
			next(err);
			return;
		}
	}
	res.render("auth/login", {
		pageTitle: "Login",
		message: "Invalid Credentials",
		entries: req.body,
	});
};

exports.postSignup = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		const emailUnique = await User.checkEmailUnique(email);

		if (!emailUnique) {
			return res.render("auth/signup", {
				pageTitle: "Signup",
				message: "Sorry, that email address is taken.  Please choose a different one.",
				entries: req.body,
			});
		}

		User.create({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
		});
		res.redirect("/auth/login");
	} catch (err) {
		console.log(err);
		res.render("auth/signup", {
			pageTitle: "Signup",
			message: "Oops!  Please correct the following errors and try again:",
			entries: req.body,
			errors: Object.values(err.errors),
		});
	}
};

exports.getLogout = (req, res) => {
	res.redirect("/");
};
