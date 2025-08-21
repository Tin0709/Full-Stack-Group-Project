// RMIT University Vietnam - COSC2769 - 2025B
// Vendor product controller

const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

const uploadRoot = path.join(
  __dirname,
  "..",
  process.env.UPLOAD_DIR || "uploads"
);
const toUploadPath = (filename) => (filename ? `/uploads/${filename}` : "");

// Safe removal of a previously stored file given its /uploads/<file> URL
async function removeIfLocalUpload(imageUrl) {
  try {
    if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
    const filepath = path.join(uploadRoot, path.basename(imageUrl));
    await fs.promises.unlink(filepath);
  } catch (_) {
    // ignore if file doesn't exist
  }
}

exports.listMyProducts = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id; // keep same shape you’re using
    const items = await Product.find({ vendor: vendorId })
      .sort({ createdAt: -1 }) // newest first
      .lean();
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
      await removeIfLocalUpload(prod.imageUrl);
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

    await removeIfLocalUpload(prod.imageUrl);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
