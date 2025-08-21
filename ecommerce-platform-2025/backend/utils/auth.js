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
