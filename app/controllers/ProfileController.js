const db = require("../config/db");

module.exports = {
  // ----------------------------------------------------------
  // GET /api/profile
  // ----------------------------------------------------------
  get: (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    // Récupération des données de l'utilisateur
    db.query(
      "SELECT id, username, email, role, address, photo_path FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Erreur serveur" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Utilisateur introuvable" });
        }
        res.json(results[0]);
      },
    );
  },

  // ----------------------------------------------------------
  // POST /api/profile
  // ----------------------------------------------------------
  update: (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const { address } = req.body;

    // Mise à jour de l'adresse de l'utilisateur
    db.query(
      "UPDATE users SET address = ? WHERE id = ?",
      [address, userId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur serveur" });
        }
        res.json({ message: "Profil mis à jour" });
      },
    );
  },

  // ----------------------------------------------------------
  // POST /api/profile/photo
  // ----------------------------------------------------------
  uploadPhoto: (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const photoPath = "/uploads/" + req.file.filename;

    // Mise à jour du chemin de la photo dans la DB
    db.query(
      "UPDATE users SET photo_path = ? WHERE id = ?",
      [photoPath, userId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur serveur" });
        }
        res.json({ message: "Photo mise à jour", photo_path: photoPath });
      },
    );
  },
};
