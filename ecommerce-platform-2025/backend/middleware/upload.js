// upload middleware - Task 1,3
// profilePictureUpload()
// productImageUpload()// backend/middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dest = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dest),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = { uploadImage };
