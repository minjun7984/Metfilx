/**
 * @deprecated
 */
 const mysql = require("mysql2");
 const env = require("dotenv");

 env.config();
 
 const dbConfig = {
   host: process.env.MYSQL_HOST,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database: process.env.MYSQL_DATABASE,
 };
 
 /**
  * DB 설정
  */
 const connection = mysql.createConnection(dbConfig);
 connection.connect(() => {
   console.log("✅ DB Connected");
 });
 
 module.exports = connection;
