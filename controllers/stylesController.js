const MustacheStyle = require("../models/MustacheStyle");

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
		const style = MustacheStyle.findOne({ titleSlug: styleSlug.toLowerCase() });
		res.render("gallery-single-post", {
			pageTitle: style.title,
			style,
			path: req.baseUrl,
		});
	} catch (e) {
		console.log("error: ", e);
	}
};
