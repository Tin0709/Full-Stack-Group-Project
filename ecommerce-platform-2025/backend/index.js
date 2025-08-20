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
const { attachCurrentUser } = require("./middleware/auth"); // adds req.currentUser

const app = express();

/* ---------------------------- Database connect ---------------------------- */
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
connectDB(process.env.MONGODB_URI);

/* ---------------------------------- CORS --------------------------------- */
// Put CORS before any routes/parsers that need it
const origin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin, credentials: true }));
app.options("*", cors({ origin, credentials: true })); // handle preflight

/* ------------------------------ Body parsers ----------------------------- */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------------------- Session -------------------------------- */
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET missing");
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // ok for http://localhost:5173 -> http://localhost:5001
      secure: false, // set true only when behind HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7,
    }),
  })
);

/* ------------------------------ Static files ----------------------------- */
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(uploadDir));

/* --------------------------- Attach current user ------------------------- */
app.use(attachCurrentUser);

/* --------------------------------- Routes -------------------------------- */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/account", require("./routes/accountRoutes"));

/* Feature routes for the new pages */
app.use("/api/vendor", require("./routes/vendorRoutes")); // VendorViewProducts + VendorAddProduct
app.use("/api/shipper", require("./routes/shipperRoutes")); // ShipperOrdersList + ShipperOrderDetails
app.use("/api/orders", require("./routes/orderRoutes")); // generic fallbacks used by UI

/* ----------------------------- Health & root ----------------------------- */
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("API OK. Try /api/health"));

/* ------------------------------ Error handler ---------------------------- */
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

/* --------------------------------- Start --------------------------------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
