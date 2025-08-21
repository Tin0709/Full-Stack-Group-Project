// backend/routes/shipperRoutes.js
const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/shipperController");

router.use(requireAuth, requireRole("shipper"));

router.get("/orders", ctrl.listForHub);
router.get("/orders/:id", ctrl.getOneForHub);
router.post("/orders/:id/deliver", ctrl.markDelivered);
router.post("/orders/:id/cancel", ctrl.markCanceled);

module.exports = router;
