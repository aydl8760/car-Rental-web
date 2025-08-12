const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createList,
  handleMultipleImageUpload,
} = require("../controllers/listController");

const router = express.Router();

router.post(
  "/uploadMultiImages",
  upload.array("myMultiFiles", 6),
  handleMultipleImageUpload
);
router.post("/create", authMiddleware, createList);

module.exports = router;
