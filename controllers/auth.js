const { dbConfig } = require("../config/db");
const { hashPassword } = require("../config/encrypt");

module.exports = {
	getData: (req, res) => {
		dbConfig.query(
			"SELECT u.*, s.status FROM users u JOIN status s ON u.status_id = s.idstatus;",
			(error, result) => {
				if (error) {
					res.status(500).send(error);
				}
				console.log("getData", result);
				res.status(200).send(result);
			}
		);
	},
	register: (req, res) => {
		let { username, email, age, city, password } = req.body;
		dbConfig.query(
			`INSERT INTO users (username, email, age, city, password) VALUES (${dbConfig.escape(
				username
			)}, ${dbConfig.escape(email)}, ${dbConfig.escape(age)}, ${dbConfig.escape(
				city
			)}, ${dbConfig.escape(hashPassword(password))});`,
			(error, result) => {
				if (error) {
					res.status(500).send(error);
				}
				console.log("register", result);
				res.status(200).send({
					success: true,
					message: "REGISTER SUCCESS",
				});
			}
		);
	},
	login: (req, res) => {
		let { email, password } = req.body;
		dbConfig.query(
			`SELECT 
				idusers, 
				username, 
				email, 
				age, 
				city, 
				status 
			FROM users
            JOIN status ON users.status_id = status.idstatus
            WHERE email = ${dbConfig.escape(email)} 
            AND password = ${dbConfig.escape(hashPassword(password))};`,
			(error, users) => {
				if (error) {
					res.status(500).send(error);
				}

				if (users.length > 0) {
					dbConfig.query(
						`SELECT 
							c.user_id as iduser, 
							c.product_id as idproduct, 
							p.name, 
							p.images, 
							p.brand, 
							p.category, 
							p.price, 
							c.qty, 
							c.qty * p.price as totalPrice
						FROM carts c
						JOIN products p ON product_id = p.idproducts
						WHERE user_id=${dbConfig.escape(users[0].idusers)};`,
						(error, carts) => {
							if (error) {
								res.status(500).send(error);
							}
							res.status(200).send({ ...users[0], cart: carts });
						}
					);
				}
			}
		);
	},
	keepLogin: (req, res) => {},
};
