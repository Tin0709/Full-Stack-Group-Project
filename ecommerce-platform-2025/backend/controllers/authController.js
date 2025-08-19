// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validateRegister } = require("../utils/validators");

async function register(req, res) {
  try {
    const err = validateRegister(req.body);
    if (err) return res.status(400).json({ error: err });

    const {
      role,
      username,
      password,
      name,
      address,
      businessName,
      businessAddress,
      distributionHub,
    } = req.body;

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(409).json({ error: "Username already exists" });

    // Role-specific uniqueness checks (vendor business fields must be unique among vendors)
    if (role === "vendor") {
      const dup = await User.findOne({
        role: "vendor",
        $or: [{ businessName }, { businessAddress }],
      });
      if (dup)
        return res
          .status(409)
          .json({
            error: "Business name or address already taken (among vendors)",
          });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userDoc = new User({
      username,
      passwordHash,
      role,
      profilePicture: req.file ? `profiles/${req.file.filename}` : "",
      name: role === "customer" ? name : undefined,
      address:
        role === "customer"
          ? address
          : role === "vendor"
          ? undefined
          : undefined,
      businessName: role === "vendor" ? businessName : undefined,
      businessAddress: role === "vendor" ? businessAddress : undefined,
      distributionHub: role === "shipper" ? distributionHub : undefined,
    });

    await userDoc.save();

    // Create session
    req.session.user = {
      id: userDoc._id,
      username: userDoc.username,
      role: userDoc.role,
    };

    res.status(201).json({ message: "Registered", user: sanitize(userDoc) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ error: "Missing credentials" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(401).json({ error: "Invalid username or password" });

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    res.json({ message: "Logged in", user: sanitize(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ message: "Logged out" });
  });
}

async function me(req, res) {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: "Not authenticated" });
    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    res.json({ user: sanitize(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
}

function sanitize(userDoc) {
  const u = userDoc.toObject();
  delete u.passwordHash;
  return u;
}

module.exports = { register, login, logout, me };
