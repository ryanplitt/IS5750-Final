const MustacheStyle = require("../models/MustacheStyle");

exports.getStyles = async (req, res, next) => {
	try {
		const styles = await MustacheStyle.find({});
		res.json(styles);
	} catch (error) {
		console.error("Failed to get styles:", error);
		res.status(500).json({ message: "Error fetching styles" });
	}
};
