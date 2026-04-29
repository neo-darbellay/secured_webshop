import express from "express";
import controller from "../controllers/UserController.js";

const router = express.Router();
router.get("/", controller.get);

export default router;
