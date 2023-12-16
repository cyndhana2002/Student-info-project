const express = require('express');
const personal = require('../controller/personalstucontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/generatepersonal', auth,personal.Personal );

module.exports = router;