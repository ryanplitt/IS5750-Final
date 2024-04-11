const BlogPost = require("../models/BlogPost");

exports.getBlogs = async (req, res, next) => {
	try {
		const blogs = await BlogPost.find().sort({ postDate: -1 });
		res.render("blog", { pageTitle: "Blog", blogs, path: req.baseUrl });
	} catch (e) {
		console.log("error: ", e);
	}
};

exports.getSingleBlog = async (req, res, next) => {
	const { titleSlug } = req.params;
	try {
		const blog = await BlogPost.findOne({ titleSlug: titleSlug.toLowerCase() });
		res.render("blog-single-post", {
			pageTitle: blog.title,
			blog,
			path: req.baseUrl,
		});
	} catch (e) {
		console.log("error: ", e);
	}
};
