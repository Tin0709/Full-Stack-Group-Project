// RMIT University Vietnam - COSC2769 - 2025B
// Vendor product controller

const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

const toUploadPath = (filename) => (filename ? `/uploads/${filename}` : "");

exports.listMyProducts = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;
    // ✅ use a valid sort value: -1 for newest first
    const items = await Product.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .lean();
    // Always 200 (empty array is OK)
    res.json(Array.isArray(items) ? items : []);
  } catch (err) {
    next(err);
  }
};

exports.getMyProductById = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;
    const item = await Product.findOne({
      _id: req.params.id,
      vendor: vendorId,
    }).lean();
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;
    const { name, price, description } = req.body;
    if (!name || Number(price) <= 0) {
      return res
        .status(400)
        .json({ message: "Name and a positive price are required" });
    }
    const imageUrl = req.file ? toUploadPath(req.file.filename) : "";
    const doc = await Product.create({
      vendor: vendorId,
      name: String(name).trim(),
      price: Number(price),
      description: String(description || "").slice(0, 500),
      imageUrl,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;
    const prod = await Product.findOne({
      _id: req.params.id,
      vendor: vendorId,
    });
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const { name, price, description } = req.body;
    if (name != null) prod.name = String(name).trim();
    if (price != null) prod.price = Number(price);
    if (description != null)
      prod.description = String(description).slice(0, 500);

    if (req.file) {
      if (prod.imageUrl && prod.imageUrl.startsWith("/uploads/")) {
        const p = path.join(
          process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"),
          path.basename(prod.imageUrl)
        );
        fs.promises.unlink(p).catch(() => {});
      }
      prod.imageUrl = toUploadPath(req.file.filename);
    }

    await prod.save();
    res.json(prod);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;
    const prod = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: vendorId,
    });
    if (!prod) return res.status(404).json({ message: "Product not found" });

    if (prod.imageUrl && prod.imageUrl.startsWith("/uploads/")) {
      const p = path.join(
        process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"),
        path.basename(prod.imageUrl)
      );
      fs.promises.unlink(p).catch(() => {});
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
