// routes/productRoutes.js
const express = require("express");
const { requireAuth, requireRole } = require("../utils/auth");
const vendor = require("../controllers/vendorController"); // reuse the same handler

const router = express.Router();

// Compatibility alias used by the frontend fallback:
// GET /api/products/mine  -> returns vendor's own products (200 [] if none)
router.get("/mine", requireAuth, requireRole("vendor"), vendor.listMyProducts);

module.exports = router;
