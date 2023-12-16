const express = require('express');
const students = require('../controller/passwordrenewnal');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/passwordren', auth, students.passwordrenewnal);

module.exports = router;