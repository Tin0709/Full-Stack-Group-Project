// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");
const { attachCurrentUser } = require("./middleware/auth");

// --- Required env ---
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

if (!MONGODB_URI) throw new Error("MONGODB_URI missing");
if (!SESSION_SECRET) throw new Error("SESSION_SECRET missing");

// --- App ---
const app = express();

// If you host behind a proxy/HTTPS in prod, this helps secure cookies
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// --- DB ---
connectDB(MONGODB_URI);

// --- CORS (must be before routes) ---
const corsOpts = { origin: FRONTEND_URL, credentials: true };
app.use(cors(corsOpts));
app.options("*", cors(corsOpts)); // preflight

// --- Parsers ---
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Session ---
app.use(
  session({
    name: "sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // works for http://localhost:5173 -> http://localhost:5001
      secure: false, // set true only when serving over HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7,
    }),
  })
);

// --- Static uploads ---
const uploadAbsPath = path.join(__dirname, UPLOAD_DIR);
app.use("/uploads", express.static(uploadAbsPath));

// --- Current user (adds req.currentUser / req.session.user) ---
app.use(attachCurrentUser);

// --- Routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/account", require("./routes/accountRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes")); // vendor CRUD
app.use("/api/shipper", require("./routes/shipperRoutes")); // shipper list/details
app.use("/api/orders", require("./routes/orderRoutes")); // generic fallback
app.use("/api/products", require("./routes/productRoutes"));

// --- Health / Root ---
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("API OK. Try /api/health"));

// --- 404 for unknown API routes ---
app.use("/api", (_req, res) => res.status(404).json({ message: "Not found" }));

// --- Error handler ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
