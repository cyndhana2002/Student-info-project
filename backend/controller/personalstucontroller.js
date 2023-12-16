const { PDFDocument ,rgb} = require('pdf-lib');
const fs = require('fs');
const path = require('path');

exports.Personal = async (req, res) => {
  const { name } = req.body;
  const templatePath = path.join(__dirname, '../views/psm.pdf'); 

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