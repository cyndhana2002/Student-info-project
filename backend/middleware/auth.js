const jwt = require('jsonwebtoken');
const xlsx = require('xlsx-populate');
const path = require('path');
const ErrorHandler = require('../utils/errorHandler');

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).send('Access denied...No token provided...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const workbook = await xlsx.fromFileAsync(path.join(__dirname, '../data/users.xlsx'));
    const sheet = workbook.sheet(0);

    const rows = sheet.usedRange().value();

    const userRow = rows.find((row, index) => index > 1 && row[0] === decoded.id);

    // if (!userRow) {
    //   throw new ErrorHandler('Invalid user', 401);
    // }

    const userId = rows.indexOf(userRow) + 2;

    req.user = {
      id: userId,
      // Include other user properties from the Excel sheet if needed
    };

    next();
  } catch (error) {
    res.clearCookie('token');
    res.status(400).send(error.message);
    console.log(error)

  }
};

module.exports = authenticateUser