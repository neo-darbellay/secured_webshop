import express from "express";
import { getUsers } from "../controllers/AdminController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.get("/users", [verifyToken, requireAdmin], getUsers);

export default router;
