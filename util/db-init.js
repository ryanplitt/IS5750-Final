const mongoose = require("mongoose");
const MustacheStyle = require("../models/MustacheStyle");
const BlogPost = require("../models/BlogPost");
const mustacheData = require("./mustacheData.json");
const blogData = require("./blogData.json");

// Connect to MongoDB
mongoose.connect(
	"mongodb+srv://ryanplitt:9c4NFpxojEzlypx2@cluster0.5eehl2z.mongodb.net/mustacchio?retryWrites=true&w=majority&appName=Cluster0"
);

const saveData = async () => {
	try {
		mongoose.connection.once("open", async () => {
			console.log("Connected to MongoDB");

			await MustacheStyle.insertMany(mustacheData);

			await BlogPost.insertMany(blogData);
		});
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
};

saveData();
