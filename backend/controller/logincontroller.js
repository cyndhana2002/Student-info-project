const XlsxPopulate = require('xlsx-populate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendToken = require('../utils/jwt');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/users.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');

    let existingUser = false;
    worksheet.eachRow((row) => {
      if (row.getCell(2).value === username) {
        existingUser = true;
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let userId = worksheet.getCell(`A${worksheet.rowCount}`).value || 0;
    userId++;
  
    const hashedPassword = await bcrypt.hash(password, 10);

    worksheet.getCell(`A${userId}`).value = userId;
    worksheet.getCell(`B${userId}`).value = username;
    worksheet.getCell(`C${userId}`).value = hashedPassword;

    await workbook.xlsx.writeFile(path.join(__dirname, '../data/users.xlsx'));

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/users.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');

    let foundUser;
    worksheet.eachRow((row) => {
      if (row.getCell(2).value === username) {
        foundUser = row;
      }
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }


    const userId = foundUser.getCell(1).value;
    const hashedPassword = foundUser.getCell(3).value;

    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = getJwtToken(userId);
    sendToken(token, 200,res)

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

const getJwtToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME } );
  return token;
};
module.exports = { registerUser, loginUser,getJwtToken };
