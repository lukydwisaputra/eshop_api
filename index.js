require('dotenv').config();
const express = require("express");
const { authController, productsController } = require("./controllers");
const { authRouter, productsRouter } = require("./routers");
const cors = require("cors"); // cors -> membuat izin akses kepada frontend

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.status(200).send("ESHOP API");
});

// DB Check connection
const { dbConfig } = require("./config/db");

dbConfig.getConnection((error, connection) => {
	if (error) {
		console.log("Error: MySQL COnnection", error.sqlMessage);
	}
	console.log("Connect ✅ :", connection.threadId);
});

// config router
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.listen(PORT, () => console.log(`Running ESHOP API at ${PORT}`));
