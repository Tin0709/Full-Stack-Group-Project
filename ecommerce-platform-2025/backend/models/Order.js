// backend/models/Order.js
const { Schema, model, Types } = require("mongoose");

const LineItemSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: "Product" }, // optional
    productName: { type: String, required: true }, // used by UI
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // unit price
  },
  { _id: false }
);

const ReceiverSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: "" },
    // state/zip optional/legacy
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true }, // e.g. "ORD-20250820-0001"
    customer: { type: Types.ObjectId, ref: "User" }, // optional; UI uses receiver mostly
    receiver: { type: ReceiverSchema, required: true },
    distributionHub: { type: String, required: true }, // must match user's distributionHub (shipper)
    items: { type: [LineItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "processing",
        "packed",
        "in_transit",
        "out_for_delivery",
        "shipped",
        "delivered",
        "canceled",
      ],
      default: "processing",
      index: true,
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
  },
  { timestamps: true }
);

OrderSchema.index({ distributionHub: 1, createdAt: -1 });

module.exports = model("Order", OrderSchema);
