/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

exports.requireAuth = (req, res, next) => {
  if (!req.session?.user)
    return res.status(401).json({ message: "Not authenticated" });
  next();
};

exports.requireRole = (role) => (req, res, next) => {
  if (req.session?.user?.role !== role)
    return res.status(403).json({ message: "Forbidden" });
  next();
};
