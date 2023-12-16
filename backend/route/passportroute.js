const express = require('express');
const passport = require('../controller/passportcontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/passport', auth, passport.passport);

module.exports = router;