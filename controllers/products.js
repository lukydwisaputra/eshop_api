const { dbConfig, dbQuery } = require("../config/db");
const fs = require('fs');

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
			let result = await dbQuery(`SELECT p.*, s.status FROM products p
			JOIN status s on p.status_id = s.idstatus;`)
			res.status(200).send(result);
		} catch (error) {
			console.log(error)
			res.status(500).send(error);
		}
    }, 
	addProduct: async (req, res) => {
		
		try {
			// console.log(req.body)
			console.log(req.files)
			let data = JSON.parse(req.body.data);

			let dataInput = [];
			for (const prop in data) {
				dataInput.push(dbConfig.escape(data[prop]))
			}

			console.log(dataInput);
			dataInput.splice(4,0, dbConfig.escape(`/imageProduct/${req.files[0].filename}`))
			console.log(dataInput);

			let addData = await dbQuery(`INSERT INTO products (name, brand, category, description, images, stock, price) 
				VALUES (${dataInput.join(',')});`)
	
			res.status(200).send({
				success: true,
				message: 'Add product success'
			})
		} catch (error) {
			console.log(error);
			fs.unlinkSync(`./public/imageProduct/${req.files[0].filename}`)
			res.status(500).send(error);
		}
	},
	deleteProduct: (req, res) => {
		if (req.dataToken.role === 'Admin') {
			dbConfig.query(
				`DELETE FROM products WHERE idproducts = ${dbConfig.escape(req.params.id)};`,
				(error, result) => {
					if (error) {
						res.status(500).send(error);
					}
					res.status(200).send({seccess: true, message: 'product deleted'});
				}
			);
		} else {
			res.status(401).send({seccess: false, message: 'Unauthorized'});
		}
	},
	updateProduct: async (req, res) => {
		// let data = JSON.parse(fs.readFileSync('./db.json'));
        // let productsData = JSON.parse(fs.readFileSync('./db.json')).products;

        // let index = data.products.findIndex(
        //     (val) => Object.values(req.params) == val[Object.keys(req.params)]
        // );
        // if (index >= 0) {
        //     productsData[index] = { ...productsData[index], ...req.body };
        //     data.products = productsData
        //     let json = JSON.stringify(data);

        //     fs.writeFileSync('./db.json', json);
        //     res.status(200).send(productsData[index]);
        // } else {
        //     res.status(400).send({
        //         success: false,
        //         erorr: 'Data not found ⚠️'
        //     });
        // }
		// UPDATE `eshop`.`products` SET `category` = 'Dinings' WHERE (`idproducts` = '6');
		try {
			let result = await dbQuery(`UPDATE products SET `)
		} catch (error) {
			
		}
	}
}