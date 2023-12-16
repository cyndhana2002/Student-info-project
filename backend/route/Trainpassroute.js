const express = require('express');
const trainpass= require('../controller/Trainpass');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/Train', auth, trainpass.train);

module.exports = router;