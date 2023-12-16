const express = require('express');
const buspass = require('../controller/Buscontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generate', auth, buspass.Buspass);

module.exports = router;