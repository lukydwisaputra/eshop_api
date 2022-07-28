const { dbConfig } = require("../config/db");
const { hashPassword } = require("../config/encrypt");

const objectFilter = (inputObject, dataArray) => {
	let inputKeys = Object.keys(inputObject);
	let inputValues = Object.values(inputObject);

	let result = [];
	dataArray.forEach((value) => {
		let check = [];
		inputKeys.forEach((v, i) => {
			if (value[inputKeys[i]] == inputValues[i]) {
				check.push(true);
				if (check.length == inputKeys.length) {
					result.push(value);
				}
			}
		});
	});

	return result;
};

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
		let { username, email, password } = req.body;
		console.log(req.body);
		dbConfig.query(
			`INSERT INTO users (username, email, password) VALUES 
			(${dbConfig.escape(username)}, 
			${dbConfig.escape(email)}, 
			${dbConfig.escape(hashPassword(password))});`,
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
		let { inputEmail, inputPassword } = req.body;
		dbConfig.query(
			`SELECT 
				idusers, 
				username, 
				email, 
				age, 
				city, 
				role,
				status 
			FROM users
            JOIN status ON users.status_id = status.idstatus
            WHERE email = ${dbConfig.escape(inputEmail)} 
            AND password = ${dbConfig.escape(hashPassword(inputPassword))};`,
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
	keepLogin: (req, res) => { 
		// let { inputEmail, inputPassword } = req.body;
		// console.log(req.query)
		dbConfig.query(
			`SELECT 
				idusers, 
				username, 
				email, 
				age, 
				city, 
				role,
				status 
			FROM users
            JOIN status ON users.status_id = status.idstatus
            WHERE idusers = ${dbConfig.escape(req.query.id)};`,
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
};
