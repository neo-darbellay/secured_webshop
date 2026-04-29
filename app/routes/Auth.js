import express from "express";
const router = express.Router();
import AuthController from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // Combien de temps avant que l'utilisateur puisse réessayer (ici, une minute)
  limit: 5, // La limite par IP, avant que windowMs le reset (ici, 5 requêtes max par minute)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Vous avez effectué trop de tentatives de connexion. Veuillez réessayer plus tard",
    });
  },
});

router.post("/login", limiter, AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.get("/me", verifyToken, AuthController.me);
router.post("/refresh", AuthController.refresh);
export default router;
