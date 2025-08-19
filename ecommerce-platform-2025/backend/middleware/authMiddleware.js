// backend/middleware/authMiddleware.js
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
