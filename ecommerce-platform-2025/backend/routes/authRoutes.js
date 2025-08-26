const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { validateRegistration } = require("../middleware/validation");

// ensure uploads dir exists
const dest = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dest),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

const {
  register,
  login,
  me,
  logout,
} = require("../controllers/authController");

// IMPORTANT: multer first to parse form-data, then validation, then controller
router.post(
  "/register",
  upload.single("profilePicture"),
  validateRegistration,
  register
);

router.post("/login", login);
router.get("/me", me);
router.post("/logout", logout);

module.exports = router;
