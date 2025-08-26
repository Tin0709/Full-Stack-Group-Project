// RMIT University Vietnam - COSC2769 - 2025B
// Vendor product routes

const express = require("express");
const path = require("path");
const multer = require("multer");

const { requireAuth, requireRole } = require("../utils/auth");
const { validateProduct } = require("../middleware/validation");
const vendor = require("../controllers/vendorController");

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

// Multer storage (filename keeps extension, makes it unique)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

const router = express.Router();

// List my products
router.get(
  "/products",
  requireAuth,
  requireRole("vendor"),
  vendor.listMyProducts
);

// Create a product
router.post(
  "/products",
  requireAuth,
  requireRole("vendor"),
  upload.single("image"),
  validateProduct,
  vendor.createProduct
);

// Get a single product owned by vendor
router.get(
  "/products/:id",
  requireAuth,
  requireRole("vendor"),
  vendor.getMyProductById
);

// Update a product
router.put(
  "/products/:id",
  requireAuth,
  requireRole("vendor"),
  upload.single("image"),
  validateProduct,
  vendor.updateProduct
);

// Delete a product
router.delete(
  "/products/:id",
  requireAuth,
  requireRole("vendor"),
  vendor.deleteProduct
);

module.exports = router;
