const express = require('express');
const route = express.Router();
const { authController, productsController } = require('../controllers');
const { getData, addProduct, deleteProduct } = require('../controllers/products')

route.get('/', getData);
route.get('/admin', getData);
route.post('/', addProduct);
route.delete('/', deleteProduct)

module.exports = route;