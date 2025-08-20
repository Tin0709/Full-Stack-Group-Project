// backend/routes/vendorRoutes.js
const router = require("express").Router();
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");
const ctrl = require("../controllers/vendorController");

// ---- PUBLIC: uniqueness check (no auth required) ----
// This will be available at: /api/vendor/vendors/unique
async function uniqueHandler(req, res, next) {
  try {
    const businessName = (req.query.businessName || "").trim();
    if (!businessName) return res.json({ businessNameAvailable: false });
    const taken = await User.exists({ role: "vendor", businessName });
    res.json({ businessNameAvailable: !taken });
  } catch (e) {
    next(e);
  }
}
router.get("/vendors/unique", uniqueHandler); // public
router.get("/unique", uniqueHandler); // alias if ever call /api/vendor/unique

// ---- AUTHENTICATED VENDOR ROUTES ----
router.use(requireAuth, requireRole("vendor"));

router.get("/products", ctrl.listMine);
router.post("/products", uploadImage.single("image"), ctrl.create);
router.delete("/products/:id", ctrl.remove);

// (optional) GET /api/vendor/products/:id for edit page later
module.exports = router;
