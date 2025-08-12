const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  transmission: { type: String, required: true },
  fuelType: { type: String, required: true },
  price: { type: Number, required: true },
  availableFrom: { type: Date, required: true },
  availableTo: { type: Date, required: true },
  location: { type: String, required: true },
  images: { type: Array, required: true }, // Array of image URLs
  phone: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("List", listSchema);
