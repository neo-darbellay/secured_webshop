import express from "express";
const router = express.Router();

import { index } from "../controllers/HomeController.js";

router.get("/", index);

export default router;
