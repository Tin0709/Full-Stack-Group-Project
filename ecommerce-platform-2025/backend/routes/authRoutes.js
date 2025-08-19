// backend/routes/authRoutes.js
const router = require("express").Router();
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authController");
const { profileUpload } = require("../config/upload");

router.post("/register", profileUpload.single("profilePicture"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);

module.exports = router;
