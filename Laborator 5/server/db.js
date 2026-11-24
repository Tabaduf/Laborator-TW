// Exercițiul 1a. Pool-ul de conexiuni către MariaDB.
// Valorile vin din fișierul .env (încărcat de --env-file=.env), nu sunt scrise în cod.
import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // din .env vine text, portul trebuie să fie număr
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
})
