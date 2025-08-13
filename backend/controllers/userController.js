const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { imageUploadUtil } = require("../config/cloudinary");

const updateUser = async (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({
      message: "You can only update your own Account",
    });
  }
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          password: req.body.password,
          image: req.body.image,
        },
      },
      { new: true }
    );
    const { password, ...user } = updateUser._doc;

    res.status(200).json({
      success: true,
      message: "account update successfully",
      user,
    });
  } catch (error) {
    console.error("Error update user events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    console.error("Error up loading image:", error);
    res.json({
      success: false,
      message: "Error occured during image upload",
    });
  }
};

module.exports = {
  updateUser,

  handleImageUpload,
};
