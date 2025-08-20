//Vendor operations - Task 3// backend/controllers/vendorController.js
const Product = require("../models/Product");

exports.listMine = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;
    const items = await Product.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .lean();
    // match UI keys exactly
    const out = items.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl, // UI expects imageUrl
      createdAt: p.createdAt,
    }));
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;

    const { name, price, description } = req.body;
    if (!name || Number(price) <= 0) {
      return res
        .status(400)
        .json({ message: "Name and positive price are required" });
    }
    if (name.length > 60) {
      return res.status(400).json({ message: "Name must be ≤ 60 characters" });
    }
    if (description && description.length > 500) {
      return res
        .status(400)
        .json({ message: "Description must be ≤ 500 characters" });
    }

    const doc = new Product({
      vendor: vendorId,
      name: name.trim(),
      price: Number(price),
      description: (description || "").trim(),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const saved = await doc.save();
    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      price: saved.price,
      description: saved.description,
      imageUrl: saved.imageUrl,
      createdAt: saved.createdAt,
    });
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const vendorId = req.session.user.id;
    const { id } = req.params;

    const deleted = await Product.findOneAndDelete({
      _id: id,
      vendor: vendorId,
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
