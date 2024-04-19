const axios = require("axios");
const sharp = require("sharp");

exports.getInspiration = (req, res, next) => {
	res.render("inspiration", { pageTitle: "Inspiration", path: req.path });
};

exports.fetchInspiration = async (req, res) => {
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

		// Process the first image fetched from Unsplash
		const image = response.data[0];
		const imageResponse = await axios.get(image.urls.regular, {
			responseType: "arraybuffer",
		});
		const processedImage = await sharp(imageResponse.data).resize(295, 295).grayscale().toBuffer();

		const base64Image = processedImage.toString("base64");
		const processedImageObj = {
			id: image.id,
			url: `data:image/jpeg;base64,${base64Image}`,
			alt: image.alt_description,
		};

		// Send the processed image back to the client
		res.json(processedImageObj);
	} catch (error) {
		console.error("Failed to get inspiration:", error);
		res.status(500).json({ message: "Error fetching inspiration" });
	}
};
