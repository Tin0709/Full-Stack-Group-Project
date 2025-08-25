// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Huynh Ngoc Nhat mai
// ID: s3926881

const { Schema, model } = require("mongoose");
const HubSchema = new Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Ho Chi Minh"
  address: { type: String, required: true },
});
module.exports = model("DistributionHub", HubSchema);
