import db from "../config/db.js";

export function getUsers(_req, res) {
  db.query(
    "SELECT id, username, email, role, AES_DECRYPT(address, ?) as 'address' FROM users",
    [process.env.ENCRYPTION_KEY],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erreur serveur" });
      }
      res.json(results);
    },
  );
}
