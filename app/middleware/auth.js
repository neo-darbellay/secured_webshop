// =============================================================
// Middleware d'authentification
// =============================================================

import jwt from "jsonwebtoken";

// Middleware pour vérifier que l'utilisateur est authentifié
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((cookies, cookie) => {
        const [key, value] = cookie.trim().split("=");
        cookies[key] = value;
        return cookies;
      }, {});
      token = cookies.token;
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

// Middleware pour vérifier que l'utilisateur est admin ou non
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé" });
  }
  next();
}
