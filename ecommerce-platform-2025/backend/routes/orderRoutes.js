// backend/routes/orderRoutes.js
const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const ctrl = require("../controllers/orderController");

router.use(requireAuth);

router.get("/", ctrl.listAll);
router.get("/assigned", ctrl.listAssigned);
router.get("/:id", ctrl.getOne);
router.patch("/:id", ctrl.patchStatus);

module.exports = router;
