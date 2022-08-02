const mysql = require("mysql");
const util = require('util');

// mysql.createConnection = berjalan terus
// mysql.createPool = berjalan setiap ada request ke mysql
const dbConfig = mysql.createPool({
	host: process.env.MYSQL_HOST,
	// port: kalau sudah pasti, tidak diisi tidak masalah
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_SECRETS,
	database: process.env.MYSQL_NAME,
});

const dbQuery = util.promisify(dbConfig.query).bind(dbConfig);

module.exports = { dbConfig, dbQuery };
