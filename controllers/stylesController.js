const MustacheStyle = require("../models/MustacheStyle");
const User = require("../models/user");

exports.getStyles = async (req, res, next) => {
	try {
		const styles = await MustacheStyle.find();
		res.render("gallery", { pageTitle: "Gallery", styles, path: req.baseUrl });
	} catch (e) {
		console.log("error: ", e);
	}
};

exports.getSingleStyle = async (req, res, next) => {
	const { styleSlug } = req.params;
	try {
		const style = await MustacheStyle.findOne({ titleSlug: styleSlug.toLowerCase() });
		let isFavorite = false;
		if (res.locals.user) {
			const user = await User.findById(res.locals.user._id);
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
	const userId = res.locals.user._id;

	try {
		const user = await User.findById(userId);
		const style = await MustacheStyle.findOne({ titleSlug: styleSlug.toLowerCase() });
		if (!style) {
			throw new Error("Style Not Found");
		}

		if (user.favoriteStyles.includes(style._id)) {
			user.favoriteStyles = user.favoriteStyles.filter((id) => id !== style._id);
		} else {
			user.favoriteStyles.push(style._id);
		}
		await user.save();

		const toggleResult = user.favoriteStyles.includes(style._id);
		return res.json({ isFavorite: toggleResult });
	} catch (err) {
		console.error("Error toggling favorite:", err);
		return res.json({ error: err.message });
	}
};
