const express = require("express");
const router = express.Router();
const controller = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/auth");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/logout", controller.logout);
router.get("/me", verifyToken, controller.me);

module.exports = router;
