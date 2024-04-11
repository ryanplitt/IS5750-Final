const mongoose = require("mongoose");
const slugify = require("slugify");

const blogPostSchema = new mongoose.Schema({
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
	summary: {
		type: String,
		required: true,
		maxlength: 350,
	},
	content: {
		type: String,
		required: true,
	},
	postDate: {
		type: Date,
		required: true,
		default: Date.now,
	},
	titleSlug: {
		type: String,
		required: true,
	},
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
