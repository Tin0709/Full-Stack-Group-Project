const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", maxlength: 500 },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
