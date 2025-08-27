// backend/routes/shipperRoutes.js

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
const ctrl = require("../controllers/shipperController");

router.use(requireAuth, requireRole("shipper"));

router.get("/orders", ctrl.listForHub);
router.get("/orders/:id", ctrl.getOneForHub);
router.post("/orders/:id/deliver", ctrl.markDelivered);
router.post("/orders/:id/cancel", ctrl.markCanceled);

module.exports = router;
