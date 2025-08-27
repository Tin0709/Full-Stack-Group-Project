/* RMIT University Vietnam
Course: COSC2769 - Full Stack Development
 Semester: 2025B
Assessment: Assignment 02
Author: Huynh Ngoc Nhat Mai
ID: s3926881
*/

const { Schema, model } = require("mongoose");

const ShoppingCartSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, min: 1, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("ShoppingCart", ShoppingCartSchema);
