const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, min: 1, required: true },
      },
    ],
    total: { type: Number, min: 0, required: true }, // store computed total
    status: {
      type: String,
      enum: ["active", "delivered", "canceled"],
      default: "active",
    },
    distributionHub: { type: String, required: true },
    shipperId: { type: Schema.Types.ObjectId, ref: "User" },
    deliveredAt: Date,
    canceledAt: Date,
  },
  { timestamps: true }
);

// queries for dashboards
OrderSchema.index({ customerId: 1, status: 1 });
OrderSchema.index({ distributionHub: 1, status: 1 });
OrderSchema.index({ shipperId: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });

module.exports = model("Order", OrderSchema);
