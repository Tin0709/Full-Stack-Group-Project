// controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../models/User"); // adjust path to your model

exports.register = async (req, res, next) => {
  try {
    const { role, username, password } = req.body;
    if (!role || !username || !password) {
      return res
        .status(400)
        .json({ message: "Missing role/username/password" });
    }

    // role-specific fields
    const payload = { role, username };
    if (role === "customer") {
      const { fullName, address } = req.body;
      if (!fullName || !address)
        return res.status(400).json({ message: "Missing fullName/address" });
      payload.fullName = fullName;
      payload.address = address;
    } else if (role === "vendor") {
      const { businessName, businessAddress } = req.body;
      if (!businessName || !businessAddress)
        return res
          .status(400)
          .json({ message: "Missing businessName/businessAddress" });
      payload.businessName = businessName;
      payload.businessAddress = businessAddress;
    } else if (role === "shipper") {
      const { distributionHub } = req.body;
      if (!distributionHub)
        return res.status(400).json({ message: "Missing distributionHub" });
      payload.distributionHub = distributionHub;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // file (optional)
    if (req.file) payload.profilePictureUrl = `/uploads/${req.file.filename}`;

    // hash & save
    const hash = await bcrypt.hash(password, 10);
    payload.passwordHash = hash;

    const user = await User.create(payload);

    // set session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    return res.status(201).json(req.session.user);
  } catch (err) {
    // duplicate username, etc.
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already taken" });
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

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    res.json(req.session.user);
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res) => {
  if (!req.session?.user)
    return res.status(401).json({ message: "Not authenticated" });
  res.json(req.session.user);
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
};
