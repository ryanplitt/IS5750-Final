const MustacheStyle = require("../models/MustacheStyle");

exports.getStyles = async (req, res, next) => {
  try {
    const styles = await MustacheStyle.findAll();
    res.render("gallery", { pageTitle: "Gallery", styles, path: req.baseUrl });
  } catch (e) {
    console.log("error: ", e);
  }
};

exports.getSingleStyle = async (req, res, next) => {
  const { styleSlug } = req.params;
  try {
    const styles = await MustacheStyle.findAll();
    const style = styles.find(
      (style) => style.titleSlug.toLowerCase() === styleSlug
    );
    res.render("gallery-single-post", {
      pageTitle: style.title,
      style,
      path: req.baseUrl,
    });
  } catch (e) {
    console.log("error: ", e);
  }
};
