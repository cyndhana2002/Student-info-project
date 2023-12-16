const express = require('express');
const student = require('../controller/studentcontroller');
const auth=require('../middleware/auth');

const router = express.Router();


router.post('/studentsignup', auth, student.signupstudent);
router.post('/student', auth, student.loginstudent);
router.put('/update/:Student_roll', auth, student.update);
router.get('/view/:Student_roll', auth,student.studentview );
module.exports = router;