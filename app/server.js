require("dotenv").config({ path: "../.env" });

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const https = require("https");
const fs = require("fs");

const app = express();
const options = {
  key: fs.readFileSync("key.pem"), // Path to your private key
  cert: fs.readFileSync("cert.pem"), // Path to your certificate
};

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fichiers statiques (CSS, images, uploads...)
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------
// Routes API (retournent du JSON)
// ---------------------------------------------------------------
const authRoute = require("./routes/Auth");
const profileRoute = require("./routes/Profile");
const adminRoute = require("./routes/Admin");

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/admin", adminRoute);

// ---------------------------------------------------------------
// Routes pages (retournent du HTML)
// ---------------------------------------------------------------
const homeRoute = require("./routes/Home");
const userRoute = require("./routes/User");
const { verifyToken, requireAdmin } = require("./middleware/auth");

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
server.listen(8080, () => {
  console.log("Serveur démarré sur https://localhost:8080");
});
