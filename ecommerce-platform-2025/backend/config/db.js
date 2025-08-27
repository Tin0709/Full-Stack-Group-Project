/* RMIT University Vietnam
Course: COSC2769 - Full Stack Development
 Semester: 2025B
Assessment: Assignment 02
Author: Huynh Ngoc Nhat Mai, Nguyen Trung Tin
ID: s3926881, s3988418
*/

const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
