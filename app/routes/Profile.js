const express = require("express");
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const controller = require("../controllers/ProfileController");

// Configuration de multer pour l'upload de photos
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", verifyToken, controller.get);
router.post("/", verifyToken, controller.update);
router.post(
  "/photo",
  verifyToken,
  upload.single("photo"),
  controller.uploadPhoto,
);

module.exports = router;
