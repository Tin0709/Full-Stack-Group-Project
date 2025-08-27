// routes/productRoutes.js

/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

const express = require("express");
const Product = require("../models/Product");
const { requireAuth, requireRole } = require("../utils/auth");
const vendor = require("../controllers/vendorController");

const router = express.Router();

/**
 * PUBLIC
 * GET /api/products?q=&minPrice=&maxPrice=
 * Returns all products, newest first. Supports q (name contains),
 * and numeric minPrice/maxPrice filters.
 */
router.get("/", async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice } = req.query;

    const filter = {};
    if (q && q.trim()) {
      filter.name = { $regex: q.trim(), $options: "i" };
    }
    const price = {};
    if (minPrice !== undefined && minPrice !== "")
      price.$gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== "")
      price.$lte = Number(maxPrice);
    if (Object.keys(price).length) filter.price = price;

    const products = await Product.find(filter)
      .populate("vendor", "businessName")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    next(err);
  }
});

/**
 * PUBLIC
 * GET /api/products/:id
 * Single product with vendor’s businessName.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id).populate(
      "vendor",
      "businessName"
    );
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * VENDOR (compat alias used by frontend vendor page)
 * GET /api/products/mine
 * Returns vendor's own products.
 */
router.get("/mine", requireAuth, requireRole("vendor"), vendor.listMyProducts);

module.exports = router;
