const { imageUploadUtil } = require("../config/cloudinary");
const List = require("../models/list");
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

const getListsByUserAdminId = async (req, res, next) => {
  if (req.userId !== req.params.uid) {
    return res.status(403).json({
      success: false,
      message: "You can only view your own listing",
    });
  }
  try {
    const userlists = await List.find({ owner: req.params.uid }).populate(
      "owner",
      "userName email"
    );
    res.status(200).json(userlists);
  } catch (error) {
    next(error);
  }
};

const getSerachList = async (req, res, next) => {
  try {
    const {
      brand = [],
      model = [],
      fuelType = [],
      year = [],
      condition = [],
      sortBy = "price-lowtohigh",
      searchTerm = "",
      limit = 12,
      startIndex = 0,
    } = req.query;

    let filters = {};

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    if (model.length) {
      filters.model = { $in: model.split(",") };
    }

    if (fuelType?.length) {
      filters.fuelType = { $in: fuelType.split(",") };
    }

    if (condition.length) {
      filters.condition = { $in: condition.split(",") };
    }

    if (year.length) {
      const yearRange = year.split(",").map(Number);
      filters.year = { $in: yearRange };
    }

    if (searchTerm) {
      const yearSearch = parseInt(searchTerm);
      const yearFilter = !isNaN(yearSearch) ? { year: yearSearch } : null;
      filters.$or = [
        { make: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
        { model: { $regex: searchTerm, $options: "i" } },

        { condition: { $regex: searchTerm, $options: "i" } },
        { fuelType: { $regex: searchTerm, $options: "i" } },
        ...(yearFilter ? [yearFilter] : []),
      ];
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;

      case "title-az":
        sort.model = 1;
        break;

      case "title-za":
        sort.model = -1;
        break;

      default:
        sort.price = 1;
        break;
    }
    const lists = await List.find(filters)
      .sort(sort)
      .limit(limit)
      .skip(startIndex);
    res.status(200).json({
      success: true,
      lists,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

module.exports = {
  createList,
  handleMultipleImageUpload,
  getListsByUserAdminId,
  getSerachList,
};
