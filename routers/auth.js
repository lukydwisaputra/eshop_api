const express = require('express');
const { readToken } = require('../config/encrypt');
const route = express.Router();
const { authController } = require('../controllers');

route.get('/all', authController.getData);
route.post('/login', authController.login);
route.post('/register', authController.register);
route.get('/keep', readToken, authController.keepLogin);

module.exports = route;
