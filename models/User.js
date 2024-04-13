const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
	password: {
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

userSchema.pre("save", async function (next) {
	console.log("pre save", this.password);
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.validatePassword = function (enteredPassword) {
	return bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.checkEmailUnique = async function (email) {
	const user = await this.findOne({ email: email });
	return !Boolean(user);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
