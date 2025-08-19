const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 20,
      trim: true,
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" }, // filename/path if you store locally
    description: { type: String, maxlength: 500, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// helpful indexes
ProductSchema.index({ vendorId: 1, isActive: 1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ isActive: 1, price: 1 });

module.exports = model("Product", ProductSchema);
