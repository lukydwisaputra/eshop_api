const { dbConfig } = require("../config/db");

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
			"SELECT * FROM products;",
			(error, result) => {
				if (error) {
					res.status(500).send(error);
				}
				console.log("getData", result);
				res.status(200).send(result);
			}
		);
    }, 
	addProduct: (req, res) => {
		let { name, brand, category, description, images, stock, price } = req.body;
		console.log(req.body)
		dbConfig.query(
			`INSERT INTO products (name, brand, category, description, images, stock, price) VALUES 
			(
				${dbConfig.escape(name)},
				${dbConfig.escape(brand)},
				${dbConfig.escape(category)},
				${dbConfig.escape(description)},
				${dbConfig.escape(images)},
				${stock},
				${price}
			);`,
			(error, result) => {
				if (error) {
					res.status(500).send(error);
				}
				res.status(200).send(result);
			}
		);
	},
	deleteProduct: (req, res) => {
		let id = req.query.id;
		dbConfig.query(
			`DELETE FROM products WHERE idproducts = ${dbConfig.escape(id)};`,
			(error, result) => {
				if (error) {
					res.status(500).send(error);
				}
				res.status(200).send(result);
			}
		);
	}
}