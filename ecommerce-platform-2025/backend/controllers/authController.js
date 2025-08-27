/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

const bcrypt = require("bcrypt");
const User = require("../models/User");

// Shape the object we send to the client (never include passwordHash)
function toSessionUser(u) {
  return { id: String(u._id), username: u.username, role: u.role };
}

exports.register = async (req, res, next) => {
  try {
    const { role, username, password } = req.body;
    if (!role || !username || !password) {
      return res
        .status(400)
        .json({ message: "Missing role/username/password" });
    }

    const payload = { role, username };

    if (role === "customer") {
      const { fullName, address } = req.body;
      if (!fullName || !address) {
        return res.status(400).json({ message: "Missing fullName/address" });
      }
      payload.fullName = fullName;
      payload.address = address;
    } else if (role === "vendor") {
      const { businessName, businessAddress } = req.body;
      if (!businessName || !businessAddress) {
        return res
          .status(400)
          .json({ message: "Missing businessName/businessAddress" });
      }
      payload.businessName = businessName;
      payload.businessAddress = businessAddress;
    } else if (role === "shipper") {
      const { distributionHub } = req.body;
      if (!distributionHub) {
        return res.status(400).json({ message: "Missing distributionHub" });
      }
      payload.distributionHub = distributionHub;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Optional profile picture
    if (req.file) {
      payload.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Hash password
    payload.passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create(payload);

    // Start session
    req.session.user = toSessionUser(user);
    return res.status(201).json(req.session.user);
  } catch (err) {
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or unique field already taken" });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = toSessionUser(user);
    res.json(req.session.user);
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.session.user);
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
};
