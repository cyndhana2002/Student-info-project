const express = require('express');
const loginUser = require('../controller/logincontroller');

const router = express.Router();

router.post('/signup',loginUser.registerUser)

router.post('/create',loginUser.loginUser)

module.exports = router;