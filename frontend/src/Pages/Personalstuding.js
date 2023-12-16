import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'reactstrap';
import "../Styles/Trainpass.css";
import { Row, Col } from 'reactstrap';
import anna from "../Images/symbolanna.png";
import { Document, Page } from 'react-pdf';
import axios from "axios";
import Cookies from 'js-cookie'
import { degrees, rgb, PDFDocument, StandardFonts } from 'pdf-lib';
import { saveAs } from '@progress/kendo-file-saver';
import withAuthentication from "../LoginPages/withAuthentication"
class Personalstuding extends Component {
  state = {
    accesstoken: sessionStorage.getItem('accesstoken'),
    Student_roll: sessionStorage.getItem('Student_roll'),
    semester: sessionStorage.getItem('semester'),
    year: sessionStorage.getItem('year'),
    degree: sessionStorage.getItem('degree'),
    branch: sessionStorage.getItem('branch'),
    time: sessionStorage.getItem('time'),
    studentname: sessionStorage.getItem('studentname'),
    name: '',
    academicYear: '',
    dated: '',
    fno:''
   
  };
  dated = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Add 1 to get the correct month (0-based index)
    const currentYear = currentDate.getFullYear();
    const dated = `${currentMonth}.${currentYear}`;
    this.setState({ dated });
  }
  academic = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;
    this.setState({ academicYear });
  }
  fno = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const nextYear = currentYear + 1;
    const fno = `${currentYear}-${nextYear.toString().slice(2)}`;
    this.setState({ fno });
  }
  componentDidMount() {
    this.academic();
    this.dated();
    this.fno();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name ,Student_roll,studentname,semester,degree,time,branch,year} = this.state;
    const value = {
      name: name,
      Student_roll: Student_roll,
      studentname: studentname,
      year: year,
      time: time,
      branch: branch,
      degree: degree,
      semester:semester
      
       
    };
  
    try {
      const token = Cookies.get('token');
      const headers = {
        'Content-Type': 'application/json',
        cookie: `token=${this.state.accesstoken}`,
      };
  
      console.log('token', token);
      const response = await axios.post('http://localhost:8000/personal/generatepersonal', value, { headers, withCredentials: true, responseType: 'arraybuffer' });
      const pdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      
      const fontSize = 14;
      const heading = `F.No : DEAN/CEG/BF/BKLN/${this.state.fno}/634`;
      const date = `Dated:`;
      const datefill=`.${this.state.dated}`
      const head = height - 140;
      const dates = height - 120;
      const datefillsize = height - 120;
      const lightBlackColor = rgb(0, 0, 0);
      const startY = height - 260;
      const start1Y = height - 360;
      const lineSpacing = 20;
      const marginRight = 130;
      const firstLineIndentation = '   '; 
      const textBlock = `This is to certify that ${studentname} (Roll No:${Student_roll}) is a bonafide student studying in the ${semester}(${year}) of ${degree} ${branch}(${time} Time) in this institute during the academic year ${this.state.academicYear}.`;
      const textBlock1 = `${name}`;
      this.writeContinuousText(firstPage, 48, head, lightBlackColor, heading, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 410, dates, lightBlackColor, date, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 460, datefillsize, lightBlackColor, datefill, fontSize, lineSpacing, firstLineIndentation,0,marginRight);
      this.writeContinuousText(firstPage, 67, startY, lightBlackColor, textBlock, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 67, start1Y, lightBlackColor, textBlock1, fontSize, lineSpacing, firstLineIndentation,0,marginRight);

      const modifiedPdfBytes = await pdfDoc.save();
      saveAs(new Blob([modifiedPdfBytes], { type: 'application/pdf' }), 'download.pdf');
    } catch (error) {
      console.error('Error:', error);
    }
  };
 

  writeContinuousText = async (page, x, y, color, text, size, lineSpacing, firstLineIndentation, topMargin, marginRight) => {
    const words = text.split(' ');
    const maxWidth = page.getWidth() - 2 * x - marginRight;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    let currentLine = firstLineIndentation;
  
    for (const word of words) {
      const currentWidth = context.measureText(currentLine).width;
      const wordWidth = context.measureText(word).width;
  
      if (currentWidth + wordWidth < maxWidth) {
        currentLine += (currentLine === firstLineIndentation ? '       ' : ' ') + word;
      } else {
        page.drawText(currentLine, { x, y, size, color });
        y -= lineSpacing;
        currentLine = firstLineIndentation + word;
      }
    }
  
    if (currentLine.trim() !== firstLineIndentation) {
      page.drawText(currentLine, { x, y, size, color });
    }
  };
  
  
  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };
  render() {
  

    return (
      <div>
        <Card className='outer' >
          <div className="containers">
            <br /><br />

            <Card className='innerlogo'>
              <div>
                <Row>
                  <Col className='annaimagecol'>
                    <img src={anna} className="annaimag" />
                  </Col>
                  <Col className='annaformat'>
                    <br />
                    <h3>COLLEGE OF ENGINEERING GUINDY,</h3>
                    <h3>ANNA UNIVERSITY, CHENNAI-600 025</h3>
                  </Col>
                </Row>
              </div>
            </Card>
            <Card className="contenttype">
              <h3 className="contentwrite">Please type here your letter with the format:</h3>
              <textarea
                className="inputfield"
                placeholder='This certificate is issued to enable the student to'
                value={this.state.name}
                onChange={this.handleNameChange}
                required
              ></textarea>
              <br />
              <div>
               
               
               
                  
       
                <button class="btn btn-success" style={{ width: "10%", marginLeft: "10px" }}>
                  <Link className='link' onClick={this.handleSubmit} >Proceed</Link>
                </button>
                <button class="btn btn-danger" style={{ width: "10%", marginLeft: "10px" }}>
                  <Link className='link' to="/BonafidePage">Back</Link>
                </button>
              </div>
            </Card>
          </div>
        </Card>
        <div className="preview-container">
          
        </div>
      </div>
    );
  }
}

export default withAuthentication(Personalstuding);
