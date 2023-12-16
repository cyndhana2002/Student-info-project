const express = require('express');
const cors = require('cors');

const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(bodyParser.json());


// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.json())
const login = require('./route/loginroute')
const student = require('./route/studentrout')
const password = require('./route/passwordrenewnal')
const bus = require('./route/Busroute')
const trainpass = require('./route/Trainpassroute')
const other = require('./route/othersroute')
const scholar = require('./route/scholarroute')
const award = require('./route/Awardroute')
const passport = require('./route/passportroute')
const visa = require('./route/Visaroute')
const personal = require('./route/Personalroute')
const spe = require('./route/Specialroute')
const bank = require('./route/Bankroute')
const income = require('./route/incomeroute')
const job= require('./route/jobapplyroute')
app.use('/', login)
app.use('/Bonafide', student)
app.use('/pass', password)
app.use('/bus', bus)
app.use('/trainpass', trainpass)
app.use('/other', other)
app.use('/scholar', scholar)
app.use('/award', award)
app.use('/pass', passport)
app.use('/visa', visa)
app.use('/personal', personal)
app.use('/spe', spe)
app.use('/bank', bank)
app.use('/income', income)
app.use('/jobapply',job)
module.exports=app