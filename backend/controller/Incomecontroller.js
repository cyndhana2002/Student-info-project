const ExcelJS = require('exceljs');
const path = require('path');
const { PDFDocument ,rgb} = require('pdf-lib');
const fs = require('fs');
exports.income = async (req, res) => {

  const { Student_roll,Father_Guardian_name, Mother, Relation } = req.body;



  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/student.xlsx'));
    const worksheet = workbook.getWorksheet('Sheet1');


    let studentRow;
    worksheet.eachRow((row) => {
      if (row.getCell(1).value === Student_roll) {
        studentRow = row;
      }
    });

    if (studentRow) {

     const existingFatherName= studentRow.getCell(6).value ;
     const existingMotherName= studentRow.getCell(7).value;
        const existingRelation=studentRow.getCell(8).value ;
        if (existingFatherName !== Father_Guardian_name || existingMotherName !== Mother || existingRelation !== Relation) {
            return res.status(400).json({ message: 'Father or Mother name does not match the existing data' });
          }
          
    } else {
        
      return res.status(404).json({ message: 'No student with the provided roll number found' });
    }


      await workbook.xlsx.writeFile(path.join(__dirname, '../data/student.xlsx'));
      const templatePath = path.join(__dirname, '../views/income.pdf'); 

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
    
  } catch (error) {
    console.error('Failed to read/write Excel file:', error);
    return res.status(500).json({ message: 'Failed to update/add student data' });
  }
};
exports.singleview = async (req, res) => {
  try {
    const Student_roll = parseInt(req.params.Student_roll);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/fee.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');
    let studentRow;

    worksheet.eachRow((row) => {
      if (row.getCell(1).value === Student_roll) {
        studentRow = row;
      }
    });

    if (!studentRow) {
      return res.status(404).json({ error: 'Data not found' });
    }

   
    const studentData = {
      Student_roll: studentRow.getCell(1).value,
      statuss: studentRow.getCell(2).value,
      amount: studentRow.getCell(3).value,
      wordamount: studentRow.getCell(4).value,

    };

    res.json(studentData);
  } catch (error) {
    console.error('Failed to view Student_roll:', error);
    res.status(500).json({ message: 'Failed to view Student_roll' });
  }
};
exports.feesdetail = async (req, res) => {
  const { Student_roll, status ,amount,wordamount} = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/fee.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');

    
    let existingStudent_roll = false;
    worksheet.eachRow((row) => {
      if (row.getCell(2).value === Student_roll) {
        existingStudent_roll = true;
      }
    });

    if (existingStudent_roll) {
      return res.status(400).json({ message: 'Student_roll already exists' });
    }

    const newRow = worksheet.addRow();

    newRow.getCell(1).value = Student_roll;
    newRow.getCell(2).value = status;
    newRow.getCell(3).value = amount;
    newRow.getCell(4).value = wordamount

    await workbook.xlsx.writeFile(path.join(__dirname, '../data/fee.xlsx'));

    res.status(201).json({ message: 'Student_roll registered successfully' });
  } catch (error) {
    console.error('Failed to register Student_roll:', error);
    res.status(500).json({ message: 'Failed to register Student_roll' });
  }
};

exports.checkfee = async (req, res) => {
  const { Student_roll } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/fee.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');

    const workbook1 = new ExcelJS.Workbook();
    await workbook1.xlsx.readFile(path.join(__dirname, '../data/student.xlsx'));

    const worksheet2 = workbook1.getWorksheet('Sheet1');

    let foundStudent_roll;
    worksheet.eachRow((row) => {
      if (row.getCell(1).value === Student_roll) {
        foundStudent_roll = row;
      }
    });

    if (!foundStudent_roll) {
      return res.status(401).json({ message: 'Invalid Student_roll' });
    }

    let foundStudent_rollInStudent;
    worksheet2.eachRow((row) => {
      if (row.getCell(1).value === Student_roll) {
        foundStudent_rollInStudent = row;
      }
    });

    if (!foundStudent_rollInStudent) {
      return res.status(401).json({ message: 'Student_roll not found in student data' });
    }
    const statuss = foundStudent_roll.getCell(2).value;
    const amount = foundStudent_roll.getCell(3).value;
    const wordamount = foundStudent_roll.getCell(4).value;
    res.status(500).json({ message: 'success ', data: { statuss,amount,wordamount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed ' });
  }
};





