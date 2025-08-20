// backend/routes/vendorRoutes.js
const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");
const ctrl = require("../controllers/vendorController");

router.use(requireAuth, requireRole("vendor"));

router.get("/products", ctrl.listMine);
router.post("/products", uploadImage.single("image"), ctrl.create);
router.delete("/products/:id", ctrl.remove);

// (optional) GET /api/vendor/products/:id for edit page later
module.exports = router;
