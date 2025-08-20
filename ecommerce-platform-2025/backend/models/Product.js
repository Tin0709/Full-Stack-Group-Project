// backend/models/Product.js
const { Schema, model, Types } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 60, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, maxlength: 500, default: "" },
    imageUrl: { type: String, default: "" }, // e.g. "/uploads/123.png"
    vendor: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

ProductSchema.index({ vendor: 1, createdAt: -1 });

module.exports = model("Product", ProductSchema);
