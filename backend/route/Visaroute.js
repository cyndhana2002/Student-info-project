const express = require('express');
const visa = require('../controller/Visacontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generatevisa', auth,visa.Visa );

module.exports = router;