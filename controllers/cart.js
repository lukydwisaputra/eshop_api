const { dbQuery, dbConfig } = require("../config/db");

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
	get: async (req, res) => {
		try {
			let carts = await dbQuery("SELECT * FROM carts;");

			let isSorting = Object.keys(req.query).length > 0;
			let sortedCarts = objectFilter(req.query, carts);

			if (isSorting) {
				if (sortedCarts.length > 0) {
					res.status(200).send({
						success: true,
						carts: sortedCarts,
					});
				} else {
					res.status(400).send({
						success: false,
						message: "Cart not found",
					});
				}
			} else {
				if (carts.length > 0) {
					res.status(200).send({
						success: true,
						carts,
					});
				} else {
					res.status(400).send({
						success: false,
						message: "Cart not found",
					});
				}
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				success: false,
				message: error,
			});
		}
	},
	add: async (req, res) => {
		try {
			if (req.dataToken.role === "User" && req.dataToken.status === "VERIFIED") {
				let idusers = req.dataToken.idusers;
				let { product_id, qty } = req.body;
				await dbQuery(`
                    INSERT INTO carts (user_id, product_id, qty) VALUES
                    (${dbConfig.escape(idusers)},
                    ${dbConfig.escape(product_id)},
                    ${dbConfig.escape(qty)});
                `);

				let carts = await dbQuery(
					`SELECT * FROM carts WHERE user_id = ${dbConfig.escape(idusers)};`
				);
				res.status(200).send({
					success: true,
					message: "New cart has been submited ✅",
					carts,
				});
			} else {
				res.status(401).send({ success: false, message: "Unauthorized ❌" });
			}
		} catch (error) {
			res.status(500).send({
				success: false,
				message: error,
			});
		}
	},
	update: async (req, res) => {
		try {
			if (req.dataToken.role === "User" && req.dataToken.status === "VERIFIED") {
				let id = req.params.id;
				let user_id = req.dataToken.idusers;
				let carts = await dbQuery(
					`SELECT * FROM carts WHERE idcarts = ${dbConfig.escape(
						id
					)} AND user_id = ${dbConfig.escape(user_id)};`
				);
				if (carts.length > 0) {
					let prop = Object.keys(req.body);
					let value = Object.values(req.body);

					let data = prop
						.map((val, idx) => {
							return `${prop[idx]} = ${dbConfig.escape(value[idx])}`;
						})
						.join(",");

					await dbQuery(
						`UPDATE carts SET ${data} WHERE idcarts = ${dbConfig.escape(
							id
						)} AND user_id = ${dbConfig.escape(user_id)};`
					);

					carts = await dbQuery(
						`SELECT * FROM carts WHERE idcarts = ${dbConfig.escape(
							id
						)} AND user_id = ${dbConfig.escape(user_id)};`
					);
					res.status(200).send({
						success: true,
						message: "Cart has been updated ✅",
						carts,
					});
				} else {
					res.status(200).send({
						success: false,
						message: `No cart with id ${req.params.id}`,
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
	remove: async (req, res) => {
		try {
			if (req.dataToken.role === "User" && req.dataToken.status === "VERIFIED") {
				let id = req.params.id;
				let user_id = req.dataToken.idusers;
				let carts = await dbQuery(
					`SELECT * FROM carts WHERE idcarts = ${dbConfig.escape(
						id
					)} AND user_id = ${dbConfig.escape(user_id)};`
				);
				if (carts.length > 0) {
					await dbQuery(`
                        DELETE FROM carts WHERE idcarts = ${dbConfig.escape(
									id
								)} AND user_id = ${dbConfig.escape(user_id)};
                    `);

					res.status(200).send({
						success: true,
						message: "Cart has been deleted ✅",
					});
				} else {
					res.status(200).send({
						success: false,
						message: `No cart with id ${id}`,
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
};
