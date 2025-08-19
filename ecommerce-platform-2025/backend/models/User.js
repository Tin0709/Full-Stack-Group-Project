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
      match: /^[A-Za-z0-9]{8,15}$/, // letters+digits only
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "vendor", "shipper"],
      required: true,
    },
    profilePicture: { type: String, default: "" },

    // role-specific fields
    name: String, // customer
    address: String, // customer
    businessName: String, // vendor
    businessAddress: String, // vendor
    distributionHub: String, // shipper
  },
  { timestamps: true }
);

// vendor-only uniqueness
UserSchema.index(
  { role: 1, businessName: 1 },
  { unique: true, partialFilterExpression: { role: "vendor" } }
);
UserSchema.index(
  { role: 1, businessAddress: 1 },
  { unique: true, partialFilterExpression: { role: "vendor" } }
);

module.exports = model("User", UserSchema);
