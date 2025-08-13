const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  updateUser,
  handleImageUpload,
} = require("../controllers/userController");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.put("/update/:id", authMiddleware, updateUser);

router.post("/uploadImage", upload.single("myFile"), handleImageUpload);

module.exports = router;
