const MustacheStyle = require("../models/MustacheStyle");
const jwt = require("jsonwebtoken");

exports.getStyles = async (req, res, next) => {
	try {
		const styles = await MustacheStyle.find({});
		res.json(styles);
	} catch (error) {
		console.error("Failed to get styles:", error);
		res.status(500).json({ message: "Error fetching styles" });
	}
};

exports.getToken = (req, res, next) => {
	const token = jwt.sign({ data: "data" }, "somesupersecretsecret", { expiresIn: "1h" });
	return res.status(200).json({ token: token });
};

exports.verifyToken = (req, res, next) => {
	const token = req.query.token;
	if (!token) {
		return res.status(400).json({ error: "Missing Token." });
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, "somesupersecretsecret");
	} catch (err) {
		return res.status(500).json({ error: "Token verification failed." });
	}
	if (!decodedToken) {
		return res.status(403).json({ error: "Not authenticated." });
	}
	next();
};
