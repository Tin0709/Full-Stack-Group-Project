// RMIT University Vietnam - COSC2769 - 2025B
// Vendor product routes

const express = require("express");
const path = require("path");
const multer = require("multer");

const { requireAuth, requireRole } = require("../utils/auth"); // small helpers below
const vendor = require("../controllers/vendorController");

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

// Multer storage (filename keeps extension, makes it unique)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    const ext = path.extname(safe);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = express.Router();

// List my products (VendorViewProducts.jsx)
router.get(
  "/products",
  requireAuth,
  requireRole("vendor"),
  vendor.listMyProducts
);

// Get one product by id (VendorEditProduct.jsx)
router.get(
  "/products/:id",
  requireAuth,
  requireRole("vendor"),
  vendor.getMyProductById
);

// Create a product (VendorAddProduct.jsx)
router.post(
  "/products",
  requireAuth,
  requireRole("vendor"),
  upload.single("image"),
  vendor.createProduct
);

// Update a product (VendorEditProduct.jsx)
router.put(
  "/products/:id",
  requireAuth,
  requireRole("vendor"),
  upload.single("image"),
  vendor.updateProduct
);

// Delete a product (VendorViewProducts.jsx)
router.delete(
  "/products/:id",
  requireAuth,
  requireRole("vendor"),
  vendor.deleteProduct
);

module.exports = router;
