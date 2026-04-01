const express = require("express");
const controller = require("../controllers/AdminController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.get("/users", [verifyToken, requireAdmin], controller.getUsers);

module.exports = router;
