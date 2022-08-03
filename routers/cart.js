const express = require('express');
const route = express.Router();
const { get, add, update, remove } = require('../controllers/cart');
const {readToken} = require('../config/encrypt')

route.get('/', get);
route.post('/', readToken, add);
route.patch('/:id', readToken, update);
route.delete('/:id', readToken, remove);

module.exports = route;
