const userController = require('../controllers/userController')

const express = require('express');
const router = express.Router();
let jwt = require('../utils/jwtAuth');

router.post('/login', userController.login);
router.post('/sendotp', userController.sendOTP);

module.exports = router;


