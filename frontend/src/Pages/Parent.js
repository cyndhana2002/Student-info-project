import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'reactstrap'
import "../Styles/Home.css"
import { Row,Col } from 'reactstrap'
import anna from "../Images/symbolanna.png"
import Cookies from 'js-cookie'
import { degrees, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from '@progress/kendo-file-saver';
import { PDFDocument } from 'pdf-lib';
import axios from "axios";
import withAuthentication from "../LoginPages/withAuthentication"
 class Parent extends Component {
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
      const response = await axios.post('http://localhost:8000/spe/generatespe', value, { headers, withCredentials: true, responseType: 'arraybuffer' });
      const pdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      
      const fontSize = 14;
      const heading = `F.No : DEAN/CEG/BF/BKLN/${this.state.fno}/240`;
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
      const textBlock = `This is to certify that ${studentname} (Roll No:${Student_roll}) is a bonafide student studying in the ${semester}  (${year} ) of ${degree} ${branch}(${time} Time) in this institute during the academic year ${this.state.academicYear}.`;
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
         <Card className='outer'style={{height:"700px"}}>
         <div className="containers">
        <br/><br/>
         
          <Card className='innerlogo'>
        <div>
          <Row>
            <Col className='annaimagecol'>
        <img src={anna}  className="annaimag" alt=" " />
        </Col><Col className='annaformat'>
          <br/>
      <h3>COLLEGE OF ENGINEERING GUINDY,</h3>
      <h3>ANNA UNIVERSITY , CHENNAI-600 025</h3></Col>
      </Row>
      </div>
      </Card>

      <Card className='centercard' style={{backgroundColor:"rgb(237, 233, 233)"}}>
        <br/>
    <p><b>Please type here your letter with format:</b></p>
    <p>Parent Name: <input type="text" id="myName" placeholder="Enter Name"></input>(optional)</p>
    <textarea id="myTextarea" value={this.state.name}
                onChange={this.handleNameChange}     style={{width: "75%",height: "200px",
                                             marginLeft: "10%",
                                             marginTop: "10px"}}></textarea>
    
      <button  class="btn btn-danger" style={{width: "15%",
                                             marginLeft: "10%",
                                             marginTop: "50px"}}>
      <Link className='link' data-mini="true" onClick={this.handleSubmit}>PROCEED</Link></button>
     <button  class="btn btn-danger" style={{width: "15%",
                                             marginLeft: "70%",
                                             marginTop: "-35px"}}>
      <Link className='link' to="/BonafidePage" data-mini="true" >BACK</Link></button>
     <br/>
      </Card>
</div>
</Card>
      </div>
    )
  }
}
export default withAuthentication(Parent);