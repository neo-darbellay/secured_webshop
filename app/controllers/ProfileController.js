import db from "../config/db.js";

function get(req, res) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  // Récupération des données de l'utilisateur
  db.query(
    `SELECT id, username, email, role, AES_DECRYPT(address, ?) as 'address', photo_path FROM users WHERE id = ?`,
    [process.env.ENCRYPTION_KEY, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erreur serveur" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }

      const user = results[0];

      if (user.address) {
        user.address = user.address.toString("utf8");
      }

      res.json(user);
    },
  );
}

function update(req, res) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  const { address } = req.body;

  // Mise à jour de l'adresse de l'utilisateur
  db.query(
    "UPDATE users SET address = AES_ENCRYPT(?, ?) WHERE id = ?",
    [address, process.env.ENCRYPTION_KEY, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur serveur" });
      }
      res.json({ message: "Profil mis à jour" });
    },
  );
}

function uploadPhoto(req, res) {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Non authentifié" });
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
}

export default { get, update, uploadPhoto };
