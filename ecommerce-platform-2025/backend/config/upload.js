// backend/config/upload.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadRoot = process.env.UPLOAD_DIR || "uploads";
const profileDir = path.join(uploadRoot, "profiles");

if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot);
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, profileDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ""));
  },
});

const profileUpload = multer({ storage });

module.exports = { profileUpload, profileDir };
