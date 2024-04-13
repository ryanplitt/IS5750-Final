const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	admin: {
		type: Boolean,
		default: false,
	},
	favoriteStyles: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Style",
		},
	],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
