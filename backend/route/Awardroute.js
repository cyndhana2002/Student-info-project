const express = require('express');
const award = require('../controller/Awardcontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generateaward', auth,award.Award );

module.exports = router;