// backend/middleware/auth.js

/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

const User = require("../models/User");

async function attachCurrentUser(req, _res, next) {
  try {
    if (!req.session?.user?.id) return next();
    if (req.currentUser && req.currentUser._id) return next();
    const u = await User.findById(req.session.user.id);
    if (u) req.currentUser = u;
    next();
  } catch (e) {
    next(e);
  }
}

function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session?.user || req.session.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { attachCurrentUser, requireAuth, requireRole };
