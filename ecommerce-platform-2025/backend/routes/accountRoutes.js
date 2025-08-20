// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const User = require("../models/User");

// --- Auth guard ---
function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

// --- Upload config (2MB) ---
const dest = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dest),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// --- GET /api/account/me ---
// Return only the fields the UI needs; never return passwordHash.
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const u = await User.findById(req.session.user.id).lean();
    if (!u) return res.status(404).json({ message: "Not found" });

    const payload = {
      id: String(u._id),
      username: u.username,
      role: u.role,

      // Customer
      fullName: u.fullName ?? u.name ?? "",
      address: u.address ?? "",

      // Vendor
      businessName: u.businessName ?? "",
      businessAddress: u.businessAddress ?? "",

      // Shipper
      distributionHub: u.distributionHub ?? "",

      // Picture (support both keys on the client)
      profilePicture: u.profilePicture || "",
      profilePictureUrl: u.profilePicture || "",
    };

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// --- POST /api/account/profile-picture ---
// Upload + persist new picture; reply with URLs used by the frontend.
router.post(
  "/profile-picture",
  requireAuth,
  upload.single("profilePicture"),
  async (req, res, next) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file provided" });

      const url = `/uploads/${req.file.filename}`;
      await User.findByIdAndUpdate(req.session.user.id, {
        $set: { profilePicture: url },
      });

      res.json({ profilePicture: url, profilePictureUrl: url });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
