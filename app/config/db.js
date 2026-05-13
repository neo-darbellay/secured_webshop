import mysql2 from "mysql2";

const connection = mysql2.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "db_user",
  password: process.env.DB_PASS || "db_password",
  database: process.env.DB_NAME || "webshop",
});

// Modifier la timezone de MySQL
connection.query(`SET time_zone = '+02:00'`);

console.log(
  `Connecté à la BDD ${connection.config.database} sur ${connection.config.host} en tant que ${connection.config.user}`,
);

export default connection;
