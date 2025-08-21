// backend/controllers/shipperController.js
const Order = require("../models/Order");
const User = require("../models/User");

function sanitize(o) {
  return {
    _id: o._id,
    code: o.code,
    createdAt: o.createdAt,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    receiver: o.receiver,
    items: (o.items || []).map((it) => ({
      id: it.product || it._id,
      name: it.productName,
      qty: it.quantity,
      price: it.price,
    })),
    customer: o.customer
      ? {
          _id: o.customer._id,
          username: o.customer.username,
          fullName: o.customer.fullName || o.customer.name,
        }
      : undefined,
  };
}

exports.listForHub = async (req, res, next) => {
  try {
    const u = await User.findById(req.session.user.id).lean();
    if (!u?.distributionHub) {
      return res
        .status(400)
        .json({ message: "Shipper must have a distribution hub" });
    }

    const rows = await Order.find({ distributionHub: u.distributionHub })
      .sort({ createdAt: -1 })
      .populate("customer", "username fullName")
      .lean();

    res.json(rows.map(sanitize));
  } catch (e) {
    next(e);
  }
};

exports.getOneForHub = async (req, res, next) => {
  try {
    const u = await User.findById(req.session.user.id).lean();
    const row = await Order.findOne({
      _id: req.params.id,
      distributionHub: u.distributionHub,
    })
      .populate("customer", "username fullName")
      .lean();

    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(sanitize(row));
  } catch (e) {
    next(e);
  }
};

exports.markDelivered = async (req, res, next) => {
  try {
    const u = await User.findById(req.session.user.id).lean();
    const row = await Order.findOneAndUpdate(
      { _id: req.params.id, distributionHub: u.distributionHub },
      { $set: { status: "delivered" } },
      { new: true }
    )
      .populate("customer", "username fullName")
      .lean();

    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(sanitize(row));
  } catch (e) {
    next(e);
  }
};

exports.markCanceled = async (req, res, next) => {
  try {
    const u = await User.findById(req.session.user.id).lean();
    const row = await Order.findOneAndUpdate(
      { _id: req.params.id, distributionHub: u.distributionHub },
      { $set: { status: "canceled" } },
      { new: true }
    )
      .populate("customer", "username fullName")
      .lean();

    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(sanitize(row));
  } catch (e) {
    next(e);
  }
};
