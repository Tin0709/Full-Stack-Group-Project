// backend/routes/orderRoutes.js

/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

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
