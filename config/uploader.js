const multer = require("multer");
const fs = require("fs");

module.exports = {
	uploader: (directory, prefix) => {
		// default directory
		let defaultDir = "./public";

		// multer configuration
		const storageUploader = multer.diskStorage({
			destination: (req, file, callback) => {
				// menentukan lokasi penyimpanan
                console.log(req.body.data.name)
				const pathDir = directory ? defaultDir + directory : defaultDir;

				// pemeriksaan path directory
				if (fs.existsSync(pathDir)) {
					// jika directory ada, maka callback akan dijalankan untuk menyimpan data
					console.log("pathDir :", pathDir);
					callback(null, pathDir);
				} else {
					fs.mkdir(pathDir, { recursive: true }, (err) => {
						if (err) {
							console.log("error make directory :", err);
						}
						console.log("Created", pathDir, "successfuly");
						return callback(err, pathDir);
					});
				}
			},
			filename: (req, file, callback) => {
				// membaca tipe data file
				let ext = file.originalname.split(".");
				let newName = prefix + Date.now() + "." + ext[ext.length - 1];
				console.log("New filename", newName);
				//  callback(null, file.originalname) -> kalau tidak mau merubah nama
				callback(null, newName);
			},
		});

		const fileFilter = (req, file, callback) => {
			const allowedExtension = /\.(jpg|png|webp|jpeg|svg)/;

			if (file.originalname.toLowerCase().match(allowedExtension)) {
				callback(null, true);
			} else {
				callback(new Error("File extension denied ❌", false));
			}
		};

		return multer({ storage: storageUploader, fileFilter });
	},
};
