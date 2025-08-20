// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

// backend/models/User.js
const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 15,
      match: /^[A-Za-z0-9]{8,15}$/, // letters+digits only (assignment rule)
    },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer", "vendor", "shipper"],
      required: true,
    },

    // Shared
    profilePicture: { type: String, default: "" }, // e.g. "/uploads/123.png"

    // Role-specific
    // Customer
    fullName: String,
    address: String,

    // Vendor
    businessName: String,
    businessAddress: String,

    // Shipper
    distributionHub: String,
  },
  { timestamps: true }
);

// Backward-compat: if some old code wrote `name` instead of `fullName`
UserSchema.virtual("name")
  .get(function () {
    return this.fullName;
  })
  .set(function (v) {
    this.fullName = v;
  });

// Indexes for vendor uniqueness (only when role === 'vendor' and field exists)
UserSchema.index(
  { role: 1, businessName: 1 },
  {
    unique: true,
    partialFilterExpression: {
      role: "vendor",
      businessName: { $exists: true, $type: "string" },
    },
  }
);
UserSchema.index(
  { role: 1, businessAddress: 1 },
  {
    unique: true,
    partialFilterExpression: {
      role: "vendor",
      businessAddress: { $exists: true, $type: "string" },
    },
  }
);

// Never leak passwordHash by default when JSON-stringifying
UserSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = model("User", UserSchema);
