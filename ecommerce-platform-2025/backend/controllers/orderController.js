// backend/controllers/orderController.js
const Order = require("../models/Order");
const User = require("../models/User");

const asList = (o) => ({
  _id: o._id,
  code: o.code,
  createdAt: o.createdAt,
  total: o.total,
  status: o.status,
  receiverName: o.receiver?.name,
});

exports.listAll = async (_req, res, next) => {
  try {
    const rows = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(rows.map(asList));
  } catch (e) {
    next(e);
  }
};

exports.listAssigned = async (req, res, next) => {
  try {
    const u = await User.findById(req.session.user.id).lean();
    const rows = await Order.find({ distributionHub: u.distributionHub })
      .sort({ createdAt: -1 })
      .lean();
    res.json(rows.map(asList));
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const row = await Order.findById(req.params.id).lean();
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (e) {
    next(e);
  }
};

exports.patchStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ok = [
      "processing",
      "packed",
      "in_transit",
      "out_for_delivery",
      "shipped",
      "delivered",
      "canceled",
    ];
    if (!ok.includes(status))
      return res.status(400).json({ message: "Bad status" });
    const row = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    ).lean();
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (e) {
    next(e);
  }
};
