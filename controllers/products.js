const { dbConfig, dbQuery } = require("../config/db");
const fs = require("fs");
const { readToken } = require("../config/encrypt");

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
	getData: async (req, res) => {
		try {
			let temp = { ...req.query };
			delete temp.lte;
			delete temp.gte;
			
			let lte = req.query?.lte;
			let gte = req.query?.gte;

			let _products = await dbQuery(`SELECT p.*, s.status FROM products p
				JOIN status s on p.status_id = s.idstatus;`);

			let products = _products.filter((val) => {
				if (lte && gte) {
					return val.price < lte && val.price > gte;
				} else if (lte && !gte) {
					return val.price < lte;
				} else if (gte && !lte) {
					return val.price > gte;
				} else {
					return val;
				}
			});

			let isSorting = Object.keys(temp).length > 0;
			let sortedProducts = objectFilter(temp, products);

			if (isSorting) {
				if (sortedProducts.length > 0) {
					res.status(200).send({
						success: true,
						products: sortedProducts,
					});
				} else {
					res.status(400).send({
						success: false,
						message: "Product not found",
					});
				}
			} else {
				if (products.length > 0) {
					res.status(200).send({
						success: true,
						products,
					});
				} else {
					res.status(400).send({
						success: false,
						message: "Product not found",
					});
				}
			}
		} catch (error) {
			res.status(500).send({
				success: false,
				message: error,
			});
		}
	},
	addProduct: async (req, res) => {
		try {
			// console.log(req.body)
			console.log(req.files);
			let data = JSON.parse(req.body.data);

			let dataInput = [];
			for (const prop in data) {
				dataInput.push(dbConfig.escape(data[prop]));
			}

			// console.log(dataInput);
			dataInput.splice(4, 0, dbConfig.escape(`/imageProduct/${req.files[0].filename}`));
			// console.log(dataInput);

			let addData =
				await dbQuery(`INSERT INTO products (name, brand, category, description, images, stock, price) 
				VALUES (${dataInput.join(",")});`);

			res.status(200).send({
				success: true,
				message: "Add product success",
			});
		} catch (error) {
			console.log(error);
			fs.unlinkSync(`./public/imageProduct/${req.files[0].filename}`);
			res.status(500).send(error);
		}
	},
	deleteProduct: (req, res) => {
		if (req.dataToken.role === "Admin") {
			dbConfig.query(
				`DELETE FROM products WHERE idproducts = ${dbConfig.escape(req.params.id)};`,
				(error, result) => {
					if (error) {
						res.status(500).send(error);
					}
					res.status(200).send({ seccess: true, message: "product deleted" });
				}
			);
		} else {
			res.status(401).send({ seccess: false, message: "Unauthorized" });
		}
	},
	updateProduct: async (req, res) => {
		try {
			if (req.dataToken.role === 'Admin') {
				let id = req.params.id;
				let products = await dbQuery(
					`SELECT * FROM products WHERE idproducts = ${dbConfig.escape(id)};`
				);
				if (products.length > 0) {
					let prop = Object.keys(req.body);
					let value = Object.values(req.body);
	
					let data = prop
						.map((val, idx) => {
							return `${prop[idx]} = ${dbConfig.escape(value[idx])}`;
						})
						.join(",");
	
					await dbQuery(`UPDATE products SET ${data} WHERE idproducts = ${dbConfig.escape(id)}`);
	
					products = await dbQuery(`SELECT p.*, s.status FROM products p
						JOIN status s on p.status_id = s.idstatus
						WHERE idproducts = ${dbConfig.escape(id)};`);
					res.status(200).send({
						success: true,
						message: "Products has been updated ✅",
						products,
					});
				} else {
					res.status(200).send({
						success: false,
						message: `No products with id ${id}`,
					});
				}
			} else {
				res.status(401).send({success: false, message: 'Not an Admin: Unauthorized ❌'})
			}
		} catch (error) {
			res.status(500).send({
				success: false,
				message: error,
			});
		}
	},
};
