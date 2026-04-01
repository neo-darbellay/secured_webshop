const argon2 = require("argon2");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const pepper = process.env.PEPPER;

async function hashPassword(password) {
  const concat = `${password}${pepper}`;

  return await argon2.hash(concat);
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

    const query = `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], async (err, results) => {
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
        const passwordMatches = await argon2.verify(
          user.password,
          `${password}${pepper}`,
        );

        if (!passwordMatches) {
          return res
            .status(401)
            .json({ error: "Email ou mot de passe incorrect" });
        }

        // Créer un JWT d'authentication
        const token = jwt.sign(
          { userId: user.id, role: user.role, username: user.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "15m",
          },
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000, // 15 minutes en milisecondes (J'aurai pu mettre 3600000 ms, mais c'est moins lisible)
        });

        // Créer un refresh token
        const refreshToken = jwt.sign(
          { userId: user.id, role: user.role, username: user.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" },
        );

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en milisecondes (J * H * M * S * MS)
        });

        res.json({ message: "Connexion réussie" });
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

      const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

      db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message, query: query });
        }

        // Récupérer l'ID de l'utilisateur inséré
        const userId = results.insertId;

        // Créer un JWT d'authentication
        const token = jwt.sign(
          { userId: userId, role: "user", username: username },
          process.env.JWT_SECRET,
          {
            expiresIn: "15m",
          },
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000, // 15 minutes en milisecondes (J'aurai pu mettre 3600000 ms, mais c'est moins lisible)
        });

        // Créer un refresh token
        const refreshToken = jwt.sign(
          { userId: userId, role: "user", username: username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" },
        );

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en milisecondes (J * H * M * S * MS)
        });

        res.json({ message: "Utilisateur créé" });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ----------------------------------------------------------
  // POST /api/auth/logout
  // ----------------------------------------------------------
  logout: (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ message: "Déconnecté" });
  },

  // ----------------------------------------------------------
  // GET /api/auth/me
  // ----------------------------------------------------------
  me: (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }
    res.json({
      userId: req.user.userId,
      role: req.user.role,
      username: req.user.username,
    });
  },

  // ----------------------------------------------------------
  // POST /api/auth/refresh
  // ----------------------------------------------------------
  refresh: (req, res) => {
    console.log(req);
    if (req.cookies.refreshToken) {
      // Vérification du refresh token
      const refreshToken = req.cookies.refreshToken;

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return res.status(401).json({ error: "Refresh token invalide" });
          } else {
            // Création d'un nouveau token d'authentification
            const newToken = jwt.sign(
              {
                userId: payload.userId,
                role: payload.role,
                username: payload.username,
              },
              process.env.JWT_SECRET,
              { expiresIn: "15m" },
            );

            // Envoi du nouveau token dans un cookie
            res.cookie("token", newToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 15 * 60 * 1000, // 15 minutes en milisecondes (J'aurai pu mettre 3600000 ms, mais c'est moins lisible)
            });

            res.json({ message: "Token rafraîchi" });
          }
        },
      );
    } else {
      return res.status(401).json({ error: "Non authentifié" });
    }
  },
  // ----------------------------------------------------------
};
