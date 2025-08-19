// backend/models/DistributionHub.js
const { Schema, model } = require("mongoose");
const HubSchema = new Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Ho Chi Minh"
  address: { type: String, required: true },
});
module.exports = model("DistributionHub", HubSchema);
