const express = require('express');
const route = express.Router();
const { authController, productsController } = require('../controllers');
const { getData, addProduct, deleteProduct, updateProduct } = require('../controllers/products')
const { uploader } = require('../config/uploader');
const {readToken} = require('../config/encrypt')

// konfigurasi uploader
const uploadFile = uploader('/imageProduct', 'IMGPRD').array('images', 1);

route.get('/', getData);
route.get('/admin', getData);

route.post('/', uploadFile, readToken, addProduct);

route.patch('/:id', readToken, updateProduct);
route.delete('/:id', readToken, deleteProduct);

module.exports = route;