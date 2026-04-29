import mysql2 from "mysql2";

const connection = mysql2.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "db_user",
  password: process.env.DB_PASS || "db_password",
  database: process.env.DB_NAME || "webshop",
});

connection.connect((err) => {
  if (err) {
    console.log(
      `${process.env.DB_HOST}:${process.env.DB_PORT} db: ${process.env.DB_NAME} u: ${process.env.DB_USER} p: ${process.env.DB_PASS}`,
    );
    console.error("Erreur de connexion à la base de données :");
    throw err;
  }
  console.log(
    `Connecté à la BDD ${connection.config.database} sur ${connection.config.host} en tant que ${connection.config.user}`,
  );
});

export default connection;
