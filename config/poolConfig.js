const mysql = require("mysql2");
const env = require("dotenv");

env.config();

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
};

/**
 * DB 설정
 */
const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();