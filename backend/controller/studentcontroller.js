const bcrypt = require('bcrypt');
const xlsx = require('xlsx');
const path = require('path');

const ExcelJS = require('exceljs');


exports.signupstudent = async (req, res) => {
  const { Student_roll,  degree, branch, time,studentname,Father_Guardian_name,Mother,Relation,joinDate,academicYear,gender} = req.body;

 
  const workbook = new ExcelJS.Workbook();
  workbook.xlsx
    .readFile(path.join(__dirname, '../data/student.xlsx'))
    .then(() => {
      const worksheet = workbook.getWorksheet('Sheet1');

   
      let existingStudent = false;
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 2 && row.getCell(1).value === Student_roll) {
          existingStudent = true;
        }
      });

      if (existingStudent) {
        return res.status(400).json({ message: 'Student roll number already exists' });
      }


      const lastRow = worksheet.lastRow;

     
      const newRow = worksheet.addRow();
      newRow.getCell(1).value = Student_roll;
      newRow.getCell(2).value = studentname;
      newRow.getCell(3).value = degree;
      newRow.getCell(4).value = branch;
      newRow.getCell(5).value = time;
      newRow.getCell(6).value = Father_Guardian_name;
      newRow.getCell(7).value = Mother;
      newRow.getCell(8).value = Relation;
      newRow.getCell(9).value = joinDate; 
      newRow.getCell(10).value = academicYear;
      newRow.getCell(11).value = gender;
   
      workbook.xlsx
        .writeFile(path.join(__dirname, '../data/student.xlsx'))
        .then(() => {
          res.status(201).json({ message: 'Student signup successful' });
        })
        .catch((error) => {
          console.error('Failed to write Excel file:', error);
          res.status(500).json({ message: 'Failed to signup student' });
        });
    })
    
};





const numberToWord = (num) => {
  const words = ["zero", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
  return words[num] || "unknown";
};

const getCurrentSemester = (joinDate, academicYear, degree) => {

  const joinDateValue = new Date(joinDate);


  const currentDate = new Date();

  if (joinDateValue > currentDate) {
    return 'Error: Join date is in the future.';
  }

  
  let totalSemesters;
  if (degree === 'BE') {
    totalSemesters = 8;
  } else if (degree === 'M.S.c(five years integrated programme)') {
    totalSemesters = 10;
  } else {
  
    totalSemesters = 8;
  }

  
  const [startYear, endYear] = academicYear.split('-');

  
  const startYearValue = parseInt(startYear);
  const endYearValue = parseInt(endYear);


  const yearDifference = currentDate.getFullYear() - startYearValue;


  let totalSemestersElapsed;

  if (degree === 'BE') {
    totalSemestersElapsed = yearDifference * 2 + (currentDate.getMonth() >= 8 ? 1 : 0);
  } else if (degree === 'M.S.c(five years integrated programme)') {
    totalSemestersElapsed = yearDifference * 2 + (currentDate.getMonth() >= 8 ? 1 : 0);
  } else {

    totalSemestersElapsed = yearDifference * 2 + (currentDate.getMonth() >= 8 ? 1 : 0);
  }


  let currentSemesterNumber = totalSemestersElapsed + 1;


  currentSemesterNumber = Math.max(1, Math.min(totalSemesters, currentSemesterNumber));


  const currentSemesterLabel = `${numberToWord(currentSemesterNumber)} semester`;


  const academicYearStart = currentDate.getMonth() >= 8 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
  const academicYearEnd = academicYearStart + 1;
  academicYear = `${academicYearStart}-${academicYearEnd}`;

  let academicYearLabel;
  
    if (currentSemesterNumber % 2 === 0) {
      academicYearLabel = `${numberToWord(currentSemesterNumber - 1)} and ${numberToWord(currentSemesterNumber)} `;
    } else {
      academicYearLabel = `${numberToWord(currentSemesterNumber)} and ${numberToWord(currentSemesterNumber + 1)} `;
    }

  const currentYear = Math.ceil(currentSemesterNumber / 2);
  const year = `${numberToWord(currentYear)} year`;

  return {
    currentSemesterLabel,
    academicYearLabel,
    academicYear,
    year
  };
};
exports.update = async (req, res) => {
  const { Student_roll } = req.params;
  const updatedData = req.body; 

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/student.xlsx'));

    const worksheet = workbook.getWorksheet('Sheet1');

    let studentRow;
    worksheet.eachRow((row) => {
      if (row.getCell(1).value === parseInt(Student_roll)) {
        studentRow = row;
      }
    });

    if (!studentRow) {
      return res.status(404).json({ error: 'Student not found' });
    }

    studentRow.getCell(2).value = updatedData.studentname;
    studentRow.getCell(3).value = updatedData.degree;
    studentRow.getCell(4).value = updatedData.branch;
    studentRow.getCell(5).value = updatedData.time;
    studentRow.getCell(6).value = updatedData.Father_Guardian_name;
    studentRow.getCell(7).value = updatedData.Mother;
    studentRow.getCell(8).value = updatedData.Relation;
    studentRow.getCell(9).value = updatedData.joinDate; 
    studentRow.getCell(10).value = updatedData.academicYear;
    studentRow.getCell(11).value = updatedData.gender;

    workbook.xlsx
    .writeFile(path.join(__dirname, '../data/student.xlsx'))
    .then(() => {
      res.status(201).json({ message: 'Student signup successful' });
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update student record' });
  }
}
exports.studentview = async (req, res) => {
  try {
    const Student_roll = parseInt(req.params.Student_roll);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/student.xlsx'));

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
      studentname:studentRow.getCell(2).value,
      degree:studentRow.getCell(3).value,
      branch: studentRow.getCell(4).value,
      time:studentRow.getCell(5).value,
      Father_Guardian_name:studentRow.getCell(6).value,
      Mother: studentRow.getCell(7).value,
      Relation:studentRow.getCell(8).value,
      joinDate:studentRow.getCell(9).value, 
      academicYear:studentRow.getCell(10).value,
      gender:studentRow.getCell(11).value
    };

    res.json(studentData);
  } catch (error) {
    console.error('Failed to view Student_roll:', error);
    res.status(500).json({ message: 'Failed to view Student_roll' });
  }
};
exports.loginstudent = async (req, res) => {
  const { Student_roll } = req.body;

  const workbook = new ExcelJS.Workbook();
  workbook.xlsx
    .readFile(path.join(__dirname, '../data/student.xlsx'))
    .then(() => {
      const worksheet = workbook.getWorksheet('Sheet1');


      let studentRow;
      worksheet.eachRow((row, rowNumber) => {
        if (row.getCell(1).value === Student_roll) {
          studentRow = row;
        }
      });

      if (studentRow) {

        const studentname = studentRow.getCell(2).value;
        const degree = studentRow.getCell(3).value;
        const branch = studentRow.getCell(4).value;
        const time = studentRow.getCell(5).value;
        const Father_Guardian_name = studentRow.getCell(6).value;
        const Mother = studentRow.getCell(7).value;
        const Relation=studentRow.getCell(8).value
        const joinDate = studentRow.getCell(9).value;
        const academicYear = studentRow.getCell(10).value;
        const gender=studentRow.getCell(11).value;
        const currentSemester = getCurrentSemester(joinDate, academicYear, degree);
      
       
        res.status(200).json({
          message: 'Student login successful',
          data: {
            degree,
            branch,
            time,
            studentname,Father_Guardian_name,Mother,Relation,joinDate,academicYear,gender,currentSemester
          },
        });
      } else {

        res.status(401).json({ message: 'Invalid student roll number' });
      }
    })
    .catch((error) => {
      console.error('Failed to read Excel file:', error);
      res.status(500).json({ message: 'Failed to login student' });
    });
};



