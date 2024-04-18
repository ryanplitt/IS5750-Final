const MustacheStyle = require("../models/MustacheStyle");
const User = require("../models/User");
const path = require("path");
const sharp = require("sharp");

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
		let isFavorite = false;
		if (res.locals.user) {
			isFavorite = res.locals.user.favoriteStyles.includes(style._id);
			console.log(res.locals.user);
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
		const user = res.locals.user;
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
		const user = res.locals.user;
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

exports.getNewStyle = (req, res, next) => {
	res.render("new-style", { pageTitle: "New Style", path: req.baseUrl });
};

exports.postNewStyle = async (req, res, next) => {
	const { title, description } = req.body;

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send("No image was uploaded.");
	}

	const style = new MustacheStyle({
		title,
		description,
	});

	const styleImage = req.files.styleImage;
	const newFileName = `${style.titleSlug}${path.extname(styleImage.name)}`;
	const uploadPath = path.join(__dirname, "../public/images/", newFileName);

	try {
		// Resize and crop the image to 295x295 pixels
		await sharp(styleImage.data)
			.resize({
				width: 295,
				height: 295,
				fit: sharp.fit.cover,
				position: sharp.strategy.entropy,
			})
			.greyscale()
			.toFormat("jpeg")
			.toFile(uploadPath);

		style.imageURL = `images/${newFileName}`;

		await style.save();

		res.redirect("/styles");
	} catch (err) {
		console.error("Error processing the image or saving new style:", err);
		res.redirect("/styles/new");
	}
};
