// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Huynh Ngoc Nhat mai
// ID: s3926881

const mongoose = require("mongoose");
const { seedHubs } = require("./seed");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log("✅ MongoDB connected");
    
    // Auto-seed distribution hubs on startup
    await seedHubs();
    
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;