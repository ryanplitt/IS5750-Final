const MustacheStyle = require("../models/MustacheStyle");
const User = require("../models/user");

exports.getStyles = async (req, res, next) => {
	try {
		const styles = await MustacheStyle.find();
		res.render("gallery", { pageTitle: "Gallery", styles, path: req.baseUrl, isFavorites: false });
	} catch (e) {
		console.log("error: ", e);
	}
};

exports.getSingleStyle = async (req, res, next) => {
	const { styleSlug } = req.params;
	try {
		const style = await MustacheStyle.findOne({ titleSlug: styleSlug.toLowerCase() });
		const user = User.hydrate(res.locals.user);
		let isFavorite = false;
		if (res.locals.user) {
			isFavorite = user.favoriteStyles.includes(style._id);
			console.log(user);
		}
		res.render("gallery-single-post", {
			pageTitle: style.title,
			style,
			path: req.baseUrl,
			isFavorite: isFavorite,
		});
	} catch (e) {
		console.log("error: ", e);
	}
};

exports.toggleFavorite = async (req, res) => {
	console.log("Made it to the styles controller toggle favorite");
	const { styleSlug } = req.params;

	try {
		const user = User.hydrate(res.locals.user);
		const style = await MustacheStyle.findOne({ titleSlug: styleSlug.toLowerCase() });
		if (!style) {
			throw new Error("Style Not Found");
		}

		let toggleResult = false;
		if (user.favoriteStyles.includes(style._id)) {
			user.favoriteStyles.pull(style._id);
		} else {
			toggleResult = true;
			user.favoriteStyles.push(style._id);
		}
		req.session.user = await user.save();

		return res.json({ isFavorite: toggleResult });
	} catch (err) {
		console.error("Error toggling favorite:", err);
		return res.json({ error: err.message });
	}
};

exports.getFavoriteStyles = async (req, res, next) => {
	try {
		const user = User.hydrate(res.locals.user);
		const favoriteStyles = await MustacheStyle.find({ _id: { $in: user.favoriteStyles } });
		res.render("gallery", {
			pageTitle: "Favorite Styles",
			styles: favoriteStyles,
			path: "/styles/favorites",
			isFavorites: true,
		});
	} catch (e) {
		console.log("error: ", e);
	}
};
