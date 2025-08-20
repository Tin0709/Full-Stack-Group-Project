// backend/index.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// --- Guards for required env ---
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}
if (!process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET is missing");
  process.exit(1);
}

// --- DB ---
connectDB(process.env.MONGODB_URI);

// --- Core middleware ---
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CORS (frontend URL must match) ---
const origin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin, credentials: true }));

// --- Session store (connect-mongo v4/v5 syntax) ---
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true in production behind HTTPS/proxy
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7,
    }),
  })
);

// --- Static files (profile pics, etc.) ---
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"))
);

// --- Routes ---
app.use("/api/auth", authRoutes);

// --- Health check ---
app.get("/api/health", (_, res) => res.json({ ok: true }));

// --- Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// --- Seed defaults (optional) ---
const { seedHubs } = require("./config/seed");
seedHubs().catch(console.error);
