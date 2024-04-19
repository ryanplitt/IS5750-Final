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
		required: false,
		validate: {
			validator: function (value) {
				return /\.(jpeg|jpg|png)$/i.test(value);
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

const BASE_IMAGE_URL = "http://localhost:3000/images/";

mustacheStyleSchema.virtual("fullImageUrl").get(function () {
	if (this.imageURL) {
		return BASE_IMAGE_URL + this.imageURL;
	}
	return null;
});

mustacheStyleSchema.set("toJSON", {
	virtuals: true,
	versionKey: false, // Exclude the __v field
	transform: function (doc, ret) {
		delete ret._id;
		delete ret.imageURL;
		delete ret.titleSlug;
		return ret;
	},
});

const MustacheStyle = mongoose.model("MustacheStyle", mustacheStyleSchema);

module.exports = MustacheStyle;
