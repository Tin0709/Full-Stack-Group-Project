// backend/controllers/orderController.js
const Order = require("../models/Order");
const User = require("../models/User");

/* ---------- helpers ---------- */
function inferHub(address = "") {
  const a = (address || "").toLowerCase();
  if (a.includes("đà nẵng") || a.includes("da nang")) return "Da Nang";
  if (a.includes("hà nội") || a.includes("ha noi") || a.includes("hanoi"))
    return "Hanoi";
  return "Ho Chi Minh";
}
async function nextOrderCode() {
  const now = new Date();
  const day = now.toISOString().slice(0, 10).replaceAll("-", "");
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const count = await Order.countDocuments({ createdAt: { $gte: start } });
  const seq = String(count + 1).padStart(4, "0");
  return `ORD-${day}-${seq}`;
}
// simple ObjectId check
const isHex24 = (v) => typeof v === "string" && /^[0-9a-fA-F]{24}$/.test(v);

/* ---------- CREATE from checkout (customer) ---------- */
exports.create = async (req, res, next) => {
  try {
    const cust = await User.findById(req.session.user.id).lean();

    const { items, receiver, paymentMethod, distributionHub } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items" });
    }

    const mapped = items.map((it) => {
      const maybeId = it.productId || it.product;
      const product = isHex24(maybeId) ? maybeId : undefined; // <-- only set if valid ObjectId
      const quantity = Math.max(1, Number(it.quantity || it.qty || 1));
      const price = Number(it.price || 0);

      return {
        product, // optional
        productName: it.productName || it.name || it.title || "Item",
        quantity,
        price,
      };
    });

    const total = mapped.reduce((s, it) => s + it.quantity * it.price, 0);

    const recv = {
      name: receiver?.name || cust?.fullName || cust?.username || "Customer",
      address: receiver?.address || cust?.address || "",
      // For this project we don’t persist state/zip anymore; hub is stored separately.
      // Keep them if other screens still need them.
      // state: receiver?.state || "",
      // zip: receiver?.zip || "",
      // City is for legacy data; hub is stored at top-level distributionHub.
      city: receiver?.city || "",
      phone: receiver?.phone || cust?.phone || "",
    };

    const hub =
      distributionHub ||
      cust?.distributionHub ||
      inferHub(`${recv.address} ${recv.city}`);

    const code = await nextOrderCode();

    const doc = await Order.create({
      code,
      customer: cust?._id,
      receiver: recv,
      distributionHub: hub,
      items: mapped,
      total,
      status: "processing",
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
};

/* ---------- generic list / assigned / get / patch ---------- */
exports.listAll = async (_req, res, next) => {
  try {
    const rows = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(
      rows.map((o) => ({
        _id: o._id,
        code: o.code,
        createdAt: o.createdAt,
        total: o.total,
        status: o.status,
        receiverName: o.receiver?.name,
      }))
    );
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
    res.json(
      rows.map((o) => ({
        _id: o._id,
        code: o.code,
        createdAt: o.createdAt,
        total: o.total,
        status: o.status,
        receiverName: o.receiver?.name,
      }))
    );
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
