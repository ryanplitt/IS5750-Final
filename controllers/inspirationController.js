const axios = require("axios");
const sharp = require("sharp");
const NodeCache = require("node-cache");
const OpenAI = require("openai");
const slugify = require("slugify");
const MustacheStyle = require("../models/MustacheStyle");
const path = require("path");

const imageCache = new NodeCache({ stdTTL: 60 * 10 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getInspiration = (req, res, next) => {
	res.render("inspiration", { pageTitle: "Inspiration", path: req.path });
};

exports.fetchInspiration = async (req, res) => {
	try {
		const image = await fetchRandomMustachePhoto(); // Get random image

		const imageResponse = await axios.get(image.urls.regular, {
			responseType: "arraybuffer",
		});

		const descriptionProcessedImage = await sharp(imageResponse.data).resize(512, 512).toBuffer();
		const processedImage = await sharp(imageResponse.data).resize(295, 295).grayscale().toBuffer();

		const processedImageObj = {
			id: image.id,
			url: convertImageToBase64Url(processedImage),
			alt: image.alt_description,
		};

		// Cache the processed image
		imageCache.set(image.id, convertImageToBase64Url(processedImage));

		const textToDisplayToUser = await getImageName(
			convertImageToBase64Url(descriptionProcessedImage)
		);

		const description = await getImageDescription(textToDisplayToUser);

		processedImageObj.title = textToDisplayToUser;
		processedImageObj.description = description;

		// Send the processed image back to the client
		res.json(processedImageObj);
	} catch (error) {
		console.error("Failed to get inspiration:", error);
		res.status(500).json({ message: "Error fetching inspiration" });
	}
};

const convertImageToBase64Url = (image) => {
	const base64Image = image.toString("base64");
	const fullImageUrl = `data:image/jpeg;base64,${base64Image}`;
	return fullImageUrl;
};

const fetchRandomMustachePhoto = async () => {
	const inspirationAxios = axios.create({
		baseURL: "https://api.unsplash.com/",
		headers: {
			Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
		},
	});

	try {
		const response = await inspirationAxios.get("photos/random", {
			params: {
				query: "mustache",
				count: 1,
			},
		});
		return response.data[0]; // Return the first image object
	} catch (error) {
		console.error("Error fetching random photo:", error);
		throw new Error("Failed to fetch random photo");
	}
};

module.exports.fetchRandomMustachePhoto = fetchRandomMustachePhoto;

getImageName = async (fullImageUrl) => {
	const response = await openai.chat.completions.create({
		model: "gpt-4-turbo",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "using only a few words, give a title to this mustache. A funny but accurate title that you might find on a barbershop",
					},
					{
						type: "image_url",
						image_url: {
							url: fullImageUrl,
							detail: "low",
						},
					},
				],
			},
		],
	});
	console.log(response.choices[0]);
	// return response.message.content.replace(/"/g, "");
	return response.choices[0].message.content.replace(/"/g, "");
};

getImageDescription = async (mustacheName) => {
	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo-0125",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `write a short one-sentence description for a mustache style that is called "${mustacheName}".`,
					},
				],
			},
		],
	});
	return response.choices[0].message.content;
};

exports.saveInspiration = async (req, res) => {
	const { title, description, imageId } = req.body;

	// Retrieve the base64 encoded image data from cache using the imageId
	const base64Image = imageCache.get(imageId);

	if (!base64Image) {
		return res.status(404).send("Image not found in cache.");
	}

	try {
		// Convert base64 string to a buffer, skipping the data URL header if present
		const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
		const buffer = Buffer.from(base64Data, "base64");

		// Define the file path
		const titleSlug = slugify(title, { lower: true });
		const newFileName = `${titleSlug}.jpg`;
		const uploadPath = path.join(__dirname, "../public/images/", newFileName);

		// Use sharp to process and save the image
		await sharp(buffer)
			.resize({
				width: 295,
				height: 295,
				fit: sharp.fit.cover,
				position: sharp.strategy.entropy,
			})
			.grayscale()
			.toFormat("jpeg")
			.toFile(uploadPath);

		// Create a new document and save to MongoDB
		const style = new MustacheStyle({
			title,
			description,
			imageURL: `images/${newFileName}`,
		});

		await style.save();
		res.redirect("/styles");
	} catch (err) {
		console.error("Error processing the image or saving to MongoDB:", err);
		next(err);
	}
};
