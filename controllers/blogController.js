const BlogPost = require("../models/BlogPost");

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await BlogPost.findAll({ order: [["postDate", "DESC"]] });
    res.render("blog", { pageTitle: "Blog", blogs, path: req.baseUrl });
  } catch (e) {
    console.log("error: ", e);
  }
};

exports.getSingleBlog = async (req, res, next) => {
  const { titleSlug } = req.params;
  try {
    const blogs = await BlogPost.findAll();
    const blog = blogs.find(
      (blog) => blog.titleSlug.toLowerCase() === titleSlug
    );
    res.render("blog-single-post", {
      pageTitle: blog.title,
      blog,
      path: req.baseUrl,
    });
  } catch (e) {
    console.log("error: ", e);
  }
};
