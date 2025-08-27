// backend/config/seed.js

/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

const DistributionHub = require("../models/DistributionHub");

async function seedHubs() {
  const defaults = [
    { name: "Ho Chi Minh", address: "1 Nguyen Hue, District 1" },
    { name: "Da Nang", address: "35 Tran Phu, Hai Chau" },
    { name: "Hanoi", address: "12 Ly Thai To, Hoan Kiem" },
  ];
  for (const h of defaults) {
    await DistributionHub.updateOne({ name: h.name }, h, { upsert: true });
  }
  console.log("✅ Hubs seeded");
}

module.exports = { seedHubs };
