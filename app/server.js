import "dotenv/config.js";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import csurf from "csurf";

import https from "https";
import fs from "fs";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const options = {
  key: fs.readFileSync("key.pem"), // Path to your private key
  cert: fs.readFileSync("cert.pem"), // Path to your certificate
};

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session pour csurf
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

const csurfProtection = csurf();

// Content Security Policy (CSP) header - helps mitigate XSS and data injection
app.use((req, res, next) => {
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data:",
    "connect-src 'self' https:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  res.setHeader("Content-Security-Policy", csp);
  next();
});

app.use(csurfProtection);

// Fichiers statiques (CSS, images, uploads...)
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------
// Routes API (retournent du JSON)
// ---------------------------------------------------------------
import authRoute from "./routes/Auth.js";
import profileRoute from "./routes/Profile.js";
import adminRoute from "./routes/Admin.js";

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/admin", adminRoute);

app.use((req, res, next) => {
  // skip CSRF
  if (req.path === "/api/csrf-token") return next();
  return csurfProtection(req, res, next);
});

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
// ---------------------------------------------------------------
// Routes pages (retournent du HTML)
// ---------------------------------------------------------------
import homeRoute from "./routes/Home.js";
import userRoute from "./routes/User.js";
import { verifyToken, requireAdmin } from "./middleware/auth.js";

app.use("/", homeRoute);
app.use("/user", userRoute);

app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "login.html")),
);
app.get("/register", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "register.html")),
);
app.get("/profile", verifyToken, (req, res) =>
  res.sendFile(path.join(__dirname, "views", "profile.html")),
);
app.get("/admin", [verifyToken, requireAdmin], (req, res) =>
  res.sendFile(path.join(__dirname, "views", "admin.html")),
);

// Démarrage du serveur
const server = https.createServer(options, app);
server.listen(8080, "0.0.0.0", () => {
  console.log("Serveur démarré sur https://localhost:8080");
});
