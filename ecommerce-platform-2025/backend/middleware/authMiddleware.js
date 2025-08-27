// backend/middleware/authMiddleware.js

/* RMIT University Vietnam
Course: COSC2769 - Full Stack Development
Semester: 2025B
Assessment: Assignment 02
Author: Huynh Ngoc Nhat Mai, Nguyen Trung Tin
ID: s3926881, s3988418
*/

function requireAuth(req, res, next) {
  if (!req.session?.user)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session?.user || req.session.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
