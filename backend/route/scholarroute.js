const express = require('express');
const scholar = require('../controller/Scholarshipcontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generatescholar', auth,scholar.Scholarship );

module.exports = router;