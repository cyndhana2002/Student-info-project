const express = require('express');
const income= require('../controller/Incomecontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generateincome', auth,income.income );
router.post('/feesdetail', auth, income.feesdetail);
router.post('/checkfee', auth, income.checkfee);
router.get('/view/:Student_roll', auth,income.singleview );
module.exports = router;