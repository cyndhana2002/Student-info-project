const { PDFDocument ,rgb} = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
exports.Bank = async (req, res) => {
  const { name } = req.body;
  const templatePath = path.join(__dirname, '../views/bank.pdf'); 

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  
  const outputFileName = 'generated.pdf';
  const outputPath = path.join(__dirname, '../output', outputFileName); 
  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync(outputPath, pdfBytes);

  res.download(outputPath); 
};

exports.semester = async (req, res) => {
  const { degree, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10 } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/semester.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');


    let existingDegree = false;
    worksheet.eachRow((row) => {
      if (row.getCell(2).value === degree) {
        existingDegree = true;
      }
    });

    if (existingDegree) {
      return res.status(400).json({ message: 'Degree already exists' });
    }

    const degreeId = worksheet.rowCount - 2 + 1;


    const newRow = worksheet.addRow();
    newRow.getCell(1).value = degreeId; 
    newRow.getCell(2).value = degree;
    newRow.getCell(3).value = sem1;
    newRow.getCell(4).value = sem2;
    newRow.getCell(5).value = sem3;
    newRow.getCell(6).value = sem4;
    newRow.getCell(7).value = sem5;
    newRow.getCell(8).value = sem6;
    newRow.getCell(9).value = sem7;
    newRow.getCell(10).value = sem8;
    newRow.getCell(11).value = sem9;
    newRow.getCell(12).value = sem10;

    
    await workbook.xlsx.writeFile(path.join(__dirname, '../data/semester.xlsx'));

    res.status(201).json({ message: 'Degree registered successfully' });
  } catch (error) {
    console.error('Failed to register degree:', error);
    res.status(500).json({ message: 'Failed to register degree' });
  }
};



exports.fee = async (req, res) => {
  const { degree} = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/semester.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');

    const workbook1 = new ExcelJS.Workbook();
    await workbook1.xlsx.readFile(path.join(__dirname, '../data/student.xlsx'));

    const worksheet2 = workbook1.getWorksheet('Sheet1');


    let foundDegree;
    worksheet.eachRow((row) => {
      if (row.getCell(2).value === degree) {
        foundDegree = row;
      }
    });

    if (!foundDegree) {
      return res.status(401).json({ message: 'Invalid degree' });
    }

    let foundDegreeInStudent;
    worksheet2.eachRow((row) => {
      if (row.getCell(3).value === degree) {
        foundDegreeInStudent = row;
      }
    });

    if (!foundDegreeInStudent) {
      return res.status(401).json({ message: 'Degree not found in student data' });
    }

    const sem1 = foundDegree.getCell(3).value;
    const sem2 = foundDegree.getCell(4).value;
    const sem3 = foundDegree.getCell(5).value;
    const sem4 = foundDegree.getCell(6).value;
    const sem5 = foundDegree.getCell(7).value;
    const sem6 = foundDegree.getCell(8).value;
    const sem7 = foundDegree.getCell(9).value;
    const sem8 = foundDegree.getCell(10).value;
    const sem9 = foundDegree.getCell(11).value;
    const sem10 = foundDegree.getCell(12).value;

    const odd = sem3 + sem5 + sem7 + sem9;
    const even = sem4 + sem6 + sem8 + sem10;


    const total = odd + even + sem1 + sem2;

    res.status(200).json({
      data: { odd, even, total, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10 },

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed ' });
  }
};