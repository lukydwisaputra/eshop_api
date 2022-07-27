const mysql = require("mysql");
require('dotenv').config();

// mysql.createConnection = berjalan terus
// mysql.createPool = berjalan setiap ada request ke mysql
const dbConfig = mysql.createPool({
	host: "localhost",
	// port: kalau sudah pasti, tidak diisi tidak masalah
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_SECRETS,
	database: "eshop",
});

module.exports = { dbConfig };
