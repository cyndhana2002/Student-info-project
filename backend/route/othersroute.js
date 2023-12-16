const express = require('express');
const others= require('../controller/OthersControllers');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/Others', auth,others.other);

module.exports = router;