const express = require('express');
const job= require('../controller/jobapply');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/job', auth,job.jobapply);

module.exports = router;