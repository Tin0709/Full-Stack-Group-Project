require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db"); // your mongoose connect helper

const app = express();

// --- DB ---
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
connectDB(process.env.MONGODB_URI);

// --- CORS (before routes) ---
const origin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin, credentials: true }));
app.options("*", cors({ origin, credentials: true })); // preflight

// --- Parsers ---
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Session (connect-mongo v4/v5) ---
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET missing");
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // fine for localhost:5173 -> 5001
      secure: false, // true only behind HTTPS/proxy
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7,
    }),
  })
);

// --- Static uploads ---
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(uploadDir));

// --- Routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/account", require("./routes/accountRoutes"));

// --- Health & root ---
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("API OK. Try /api/health"));

// --- Error handler (prevents hard crash -> “Network Error”) ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
