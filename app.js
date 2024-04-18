// Import path to construct path file names
const path = require("path");

// Import npm libraries
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const fileUpload = require("express-fileupload");

const mongoose = require("mongoose");

// import routes
const homeRoutes = require("./routes/homeRoutes");
const stylesRoutes = require("./routes/stylesRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes.js");
const errorController = require("./controllers/errorController");

const middleware = require("./middleware");

const app = express();

const MongoDBURL =
	"mongodb+srv://ryanplitt:9c4NFpxojEzlypx2@cluster0.5eehl2z.mongodb.net/mustacchio?retryWrites=true&w=majority&appName=Cluster0";

// Initialize session store
const store = new MongoDBStore({
	uri: MongoDBURL,
	collection: "sessions",
});

// Load middleware to point to static resources
app.use(express.static(path.join(__dirname, "public")));

// Load middleware to parse body
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn;
	res.locals.user = req.session.user;
	next();
});

// Set the templating engine using app.set
app.set("view engine", "ejs");

// Tell the application where to find the views
app.set("views", "views");

app.use(expressLayouts);

app.use(middleware);

app.use("/styles", stylesRoutes);
app.use("/blog", blogRoutes);
app.use("/contacts", contactRoutes);
app.use("/auth", authRoutes);

app.use(homeRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

// start the server on port 3000
mongoose
	.connect(MongoDBURL)
	.then(() => {
		app.listen(3000, () => {
			console.log("Server started on http://localhost:3000");
		});
	})
	.catch((err) => {
		console.log(err);
	});
