const { imageUploadUtil } = require("../config/cloudinary");
const list = require("../models/list");
const User = require("../models/User");

const handleMultipleImageUpload = async (req, res) => {
  try {
    const uploadedImages = [];
    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = `data:${file.mimetype};base64,${b64}`;
      const result = await imageUploadUtil(url); // Your Cloudinary upload utility function
      uploadedImages.push(result.url); // Save the Cloudinary URL
    }

    res.json({
      success: true,
      images: uploadedImages, // Return all uploaded image URLs
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.json({
      success: false,
      message: "Error occurred during images upload",
    });
  }
};

const createList = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      transmission,
      fuelType,
      price,
      availableFrom,
      availableTo,
      location,
      phone,
      color,
      images,
    } = req.body;

    // Validate required fields
    if (
      !make ||
      !model ||
      !year ||
      !transmission ||
      !fuelType ||
      !price ||
      !availableFrom ||
      !availableTo ||
      !location ||
      !phone ||
      !images
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const list = new list({
      owner: req.userId, // Ensure auth middleware sets req.user
      make,
      model,
      year,
      transmission,
      fuelType,
      price,
      availableFrom,
      availableTo,
      location,
      phone,
      color,
      images,
    });

    await list.save();

    await User.findByIdAndUpdate(req.userId, { $inc: { postsCount: 1 } });
    res.status(201).json({ success: true, list });
  } catch (err) {
    console.error("Car creation error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createList,
  handleMultipleImageUpload,
};
