const mongoose = require("mongoose");
const slugify = require("slugify");

const mustacheStyleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		set: function (value) {
			this.titleSlug = slugify(value, { lower: true });
			return value;
		},
	},
	imageURL: {
		type: String,
		required: true,
		validate: {
			validator: function (value) {
				return /\.(jpg|png)$/i.test(value);
			},
			message: "Invalid image URL",
		},
	},
	description: {
		type: String,
		required: true,
	},
	titleSlug: {
		type: String,
		required: true,
	},
});

const MustacheStyle = mongoose.model("MustacheStyle", mustacheStyleSchema);

module.exports = MustacheStyle;
