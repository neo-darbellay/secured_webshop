const argon2 = require("argon2");
const db = require("../config/db");

async function hashPassword(password) {
  return await argon2.hash(password);
}

module.exports = {
  // ----------------------------------------------------------
  // POST /api/auth/login
  // ----------------------------------------------------------
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const query = `SELECT * FROM users WHERE email = '${email}'`;

    db.query(query, async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message, query: query });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      const user = results[0];

      // Vérifier le mot de passe avec argon2
      try {
        const passwordMatches = await argon2.verify(user.password, password);

        res.json({ message: "Connexion réussie", user: user });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    });
  },

  // ----------------------------------------------------------
  // POST /api/auth/register
  // ----------------------------------------------------------
  register: async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Champs requis" });
    }

    try {
      const hashedPassword = await hashPassword(password);

      const query = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`;

      db.query(query, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message, query: query });
        }

        res.json({ message: "Utilisateur créé" });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
