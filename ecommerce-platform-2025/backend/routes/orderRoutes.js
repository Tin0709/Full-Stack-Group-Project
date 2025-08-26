// backend/routes/orderRoutes.js
const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");
const ctrl = require("../controllers/orderController");

// Everyone here must be authenticated
router.use(requireAuth);

// Customer creates order at checkout
router.post("/", requireRole("customer"), validateOrder, ctrl.create);

// Generic fallbacks used by UI
router.get("/", ctrl.listAll);
router.get("/assigned", ctrl.listAssigned);
router.get("/:id", ctrl.getOne);
router.patch("/:id", ctrl.patchStatus);

module.exports = router;
