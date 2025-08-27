// backend/config/upload.js

/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

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
