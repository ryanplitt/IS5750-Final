const User = require("../models/User");

exports.getLogin = (req, res) => {
	res.render("auth/login", { pageTitle: "Login", path: req.baseUrl });
};

exports.getSignup = (req, res) => {
	res.render("auth/signup", { pageTitle: "Signup", path: req.baseUrl });
};

exports.authUser = async (req, res, next) => {
	const email = req.body.email.toLowerCase();
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

exports.getLogout = async (req, res) => {
	try {
		await req.session.destroy();
	} catch (err) {
		console.log(err);
	}
	res.redirect("/");
};

exports.updatePrivileges = async (req, res, next) => {
	try {
		const usersUpdates = req.body.users;

		if (Array.isArray(usersUpdates)) {
			for (const userUpdate of usersUpdates) {
				const userId = userUpdate.id;
				const isAdmin = userUpdate.isAdmin === "on"; // Checkbox sends 'true' as a string if checked

				const updatedUser = await User.findByIdAndUpdate(
					userId,
					{ role: isAdmin ? "admin" : "user" },
					{ new: true }
				);

				if (userId === req.session.user._id.toString()) {
					req.session.user.role = updatedUser.role;
					await req.session.save();
				}
			}
			res.redirect("/");
		} else {
			console.error("Invalid user updates data.");
			throw new Error("Invalid user updates data.");
		}
	} catch (error) {
		console.error("Error updating user privileges:", error);
		next(error);
	}
};
