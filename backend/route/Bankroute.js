const express = require('express');
const bank= require('../controller/Bankcontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generatebank', auth,bank.Bank );
router.post('/course', auth, bank.semester);
router.post('/fee', auth,bank.fee );
module.exports = router;