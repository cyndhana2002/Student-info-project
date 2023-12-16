const express = require('express');
const spe = require('../controller/Specialcontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generatespe', auth,spe.Special );

module.exports = router;