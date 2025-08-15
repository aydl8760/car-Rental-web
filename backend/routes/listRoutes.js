const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createList,
  handleMultipleImageUpload,

  getListsByUserAdminId,
  getSerachList,
} = require("../controllers/listController");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.post(
  "/uploadMultiImages",
  upload.array("myMultiFiles", 6),
  handleMultipleImageUpload
);
router.post("/create", authMiddleware, createList);
router.get("/get", getSerachList);
router.get("/:uid", authMiddleware, getListsByUserAdminId);

module.exports = router;
