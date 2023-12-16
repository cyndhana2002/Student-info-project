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

class Bankloan extends Component {
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
    course: sessionStorage.getItem('degree'),
    odd: '',
    sem1: '',
    sem2: '',
    even: '',
    total: '',
    academicYear: '',
    dated: '',
    fno:''
   
  };
  dated = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
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
  
    const { name ,Student_roll,studentname,semester,degree,time,branch,year,course} = this.state;
    const value = {
      name: name,
      Student_roll: Student_roll,
      studentname: studentname,
      year: year,
      time: time,
      branch: branch,
      degree: degree,
      semester:semester,
      course:course
       
    };
  
    try {
      const token = Cookies.get('token');
      const headers = {
        'Content-Type': 'application/json',
        cookie: `token=${this.state.accesstoken}`,
      };
  
      console.log('token', token);
      
      const feeResponse = await axios.post('http://localhost:8000/bank/fee', value, { headers, withCredentials: true });
    
    
    if (feeResponse.data && feeResponse.data.data) {
      const { odd, even, sem1, sem2, total } = feeResponse.data.data;

      if (odd) {
        this.setState({ odd });
      }
      if (even) {
        this.setState({ even });
      }
      if (sem1) {
        this.setState({ sem1 });
      }
      if (sem2) {
        this.setState({ sem2 });
      }
      if (total) {
        this.setState({ total });
      }
    } else {
      console.log('Fee Calculation Response does not contain the required data fields.');
      }
      const response = await axios.post('http://localhost:8000/bank/generatebank', value, { headers, withCredentials: true, responseType: 'arraybuffer' });
      const pdfBytes = response.data;
      
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const heading = `F.No : DEAN/CEG/BF/BKLN/${this.state.fno}/2152`;
      const date = `Dated:`;
      const datefill=`.${this.state.dated}`
      const head = height - 140;
      const dates = height - 120;
      const datefillsize = height - 120;
      const fontSize = 14;
      const fontSize1 = 13;
      const lightBlackColor = rgb(0, 0, 0);
      const startY = height - 200;
      const start1Y = height - 280;
      const lineSpacing = 20;
      const marginRight = 160;
      const start1 = height - 386;
      const start2 = height - 414;
      const start3 = height - 442;
      const start4 = height - 470;
      const start5 = height - 505;
      const firstLineIndentation = '   '; 
      const textBlock = `This is to certify that ${studentname} (Roll No:${Student_roll}) is a bonafide student studying in the ${semester}  (${year} ) of ${degree} ${branch}(${time} Time) in this institute during the academic year ${this.state.academicYear}.`;
      const textBlock1 = `${name}`;
      const write1 =`${this.state.sem1}`
      const write2 =`${this.state.sem2}`
      const write3 =`${this.state.odd}`
      const write4=`${this.state.even}`
      const write5 = `${this.state.total}`
      this.writeContinuousText(firstPage, 10, head, lightBlackColor, heading, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 410, dates, lightBlackColor, date, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 460, datefillsize, lightBlackColor, datefill, fontSize, lineSpacing, firstLineIndentation,0,marginRight);
      this.writeContinuousText(firstPage, 30, startY, lightBlackColor, textBlock, fontSize, lineSpacing, firstLineIndentation,0,marginRight);
      this.writeContinuousText(firstPage, 30, start1Y, lightBlackColor, textBlock1, fontSize, lineSpacing, firstLineIndentation,0,marginRight);
      this.writeContinuousText(firstPage, 430, start1, lightBlackColor, write1, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 430, start2, lightBlackColor, write2, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 430, start3, lightBlackColor, write3, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 430, start4, lightBlackColor, write4, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 430, start5, lightBlackColor, write5, fontSize1, lineSpacing, firstLineIndentation, 0, marginRight);
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

export default withAuthentication(Bankloan);
