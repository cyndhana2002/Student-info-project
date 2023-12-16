import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Input, Label,FormGroup,Row,Col } from 'reactstrap'
import "../Styles/Income.css"
import anna from "../Images/symbolanna.png"
import Cookies from 'js-cookie'
import { degrees, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from '@progress/kendo-file-saver';
import { PDFDocument } from 'pdf-lib';
import axios from "axios";
import withAuthentication from "../LoginPages/withAuthentication"
class Income extends Component {
  state = {
    accesstoken: sessionStorage.getItem('accesstoken'),
    Student_roll: sessionStorage.getItem('Student_roll'),
    semester: sessionStorage.getItem('semester'),
    year: sessionStorage.getItem('year'),
    degree: sessionStorage.getItem('degree'),
    branch: sessionStorage.getItem('branch'),
    time: sessionStorage.getItem('time'),
    studentname: sessionStorage.getItem('studentname'),
    academic: sessionStorage.getItem('academic'),
    gender: sessionStorage.getItem('gender'),
    name: '',
    Relation: '',
    Father_Guardian_name: '',
    Mother: '',
    academicYear: '',
    dated: '',
    fno: '',
    statuss: '',
    amount: '',
    wordamount: '',
    errors: {
      Father_Guardian_name: '',
      Mother: '',
      Relation: '',
      err: 0,
    },
   
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
    this.fetchdetail();
    this.gender()

  }
  gender = async () => {
    const gender = this.state.gender === 'Male' ? 'S/O' : 'D/O';
    this.setState({ gender });
  }
  fetchdetail = async () => {
    const headers = {
      'Content-Type': 'application/json',
      cookie: `token=${this.state.accesstoken}`,
    };
  
    console.log('token', this.state.accesstoken);
    
    try {
      const response = await axios.get(`http://localhost:8000/income/view/${this.state.Student_roll}`, {
        headers,
        withCredentials: true,
      });
  
      console.log(response.data, "inside_response");
      if (response.data.statuss) {
        this.setState({
          statuss:response.data.statuss
        })
      }
      if (response.data.amount) {
        this.setState({
          amount:response.data.amount
        })
      }
      if (response.data.wordamount) {
        this.setState({
          wordamount:response.data.wordamount
        })
      }
    } catch (error) {
      console.log(error);
    }
  }; 

  handlechange = (e) => {
    this.setState({
      Relation:e.target.value
    })
  }
  handleSubmit = async (e) => {
    e.preventDefault();
   
    const { Father_Guardian_name, Mother, Relation } = this.state;

    if (!Father_Guardian_name) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Father_Guardian_name: 'This field is required.',
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Father_Guardian_name: '',
        },
      }));
    }
  
    if (!Mother) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Mother: 'This field is required.',
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Mother: '',
        },
      }));
    }
  
    if (!Relation) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Relation: 'This field is required.',
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Relation: '',
        },
      }));
    }

    if (!Father_Guardian_name || !Mother || !Relation) {
      return;
    }

  const { Student_roll,studentname,semester,degree,time,branch,year,} = this.state;
    const values = {
      
      Student_roll: Number(Student_roll),
      studentname: studentname,
      year: year,
      time: time,
      branch: branch,
      degree: degree,
      semester: semester,
      Father_Guardian_name: Father_Guardian_name,
      Mother: Mother,
      Relation: Relation
      
       
    };
    

    try {
      const token = Cookies.get('token');
      const headers = {
        'Content-Type': 'application/json',
        cookie: `token=${this.state.accesstoken}`,
      };

      console.log('token', token);
      const response = await axios.post('http://localhost:8000/income/generateincome', values, { headers, withCredentials: true, responseType: 'arraybuffer' });

      const pdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      
      const fontSize = 14;
      const heading = `F.No : DEAN/CEG/BF/BKLN/${this.state.fno}/914`;
      const date = `Dated:`;
      const datefill=`.${this.state.dated}`
      const head = height - 140;
      const dates = height - 120;
      const datefillsize = height - 120;
      const lightBlackColor = rgb(0, 0, 0);
      const startY = height - 260;
      const start1Y = height - 360;
      const lineSpacing = 20;
      const marginRight = 160;
      const firstLineIndentation = '   '; 
      const textBlock = `This is to certify that ${studentname} (Roll No:${Student_roll}) is a bonafide student studying in the ${semester}  (${year} ) of ${degree} ${branch}(${time} Time) in this institute during the academic year ${this.state.academicYear}.`;
      const textBlock1=`   ${studentname} ${this.state.gender} ${Father_Guardian_name}  has ${this.state.statuss} Rs.${this.state.amount}/- (Rupees ${this.state.wordamount} only.) towards tuition fees for the ${this.state.academic} semesters of this academic year ${this.state.academicYear}.`
      this.writeContinuousText(firstPage, 48, head, lightBlackColor, heading, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 410, dates, lightBlackColor, date, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      this.writeContinuousText(firstPage, 460, datefillsize, lightBlackColor, datefill, fontSize, lineSpacing, firstLineIndentation,0,marginRight);
      this.writeContinuousText(firstPage, 30, startY, lightBlackColor, textBlock, fontSize, lineSpacing, firstLineIndentation, 0, marginRight);
      
      this.writeContinuousText(firstPage, 30, start1Y, lightBlackColor, textBlock1, fontSize, lineSpacing, firstLineIndentation,0,marginRight);

      const modifiedPdfBytes = await pdfDoc.save();
      saveAs(new Blob([modifiedPdfBytes], { type: 'application/pdf' }), 'download.pdf');
    } catch (error) {
      console.error('Error:', error);
      this.setState({ err: 1 });
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
  render() {
    return (
      <div>
        <br/>
        <Card className='outer'style={{height:"700px"}}>
         <div className="containers">
        <br/><br/>
        <Card className='innerlogo'>
        <div>
          <Row>
            <Col className='annaimagecol'>
        <img src={anna}  className="annaimag"/>
        </Col><Col className='annaformat'>
          <br/>
      <h3>COLLEGE OF ENGINEERING GUINDY,</h3>
      <h3>ANNA UNIVERSITY , CHENNAI-600 025</h3></Col>
      </Row>
      </div>
      </Card>
      <Card className='incomecard' style={{backgroundColor:"rgb(237, 233, 233)",height:"400px"}}>
              <br />
              {this.state.err ? (
                      <label
                        align="center"
                        style={{ color: "red", fontSize: 16, marginTop: -50 }}
                      >
                        Father or Mother name does not match the existing data
                      </label>
                    ) : null}
 <FormGroup >
          <Row>
            <Col>
             <Label className="name">Father/Guardian Name <span class="required">*</span> </Label>
            </Col>
             <Col className='lastcol'>
              <Input
                className="inputs"
                      type="text"
                      name="Father_Guardian_name"
                     
                 onChange={(data)=>{this.setState({Father_Guardian_name:data.target.value})}}    
                    />
                    {this.state.errors.Father_Guardian_name && <span className="error">{this.state.errors.Father_Guardian_name}</span>}
                  </Col>
              </Row>
           </FormGroup>
           <FormGroup >
          <Row>
            <Col>
             <Label className="name1">Mother Name <span class="required">*</span> </Label>
            </Col>
             <Col className='lastcol'>
              <Input
               className='input1'
                      type="text"
                      name="Mother"
                     
                 onChange={(data)=>{this.setState({Mother:data.target.value})}}    
                    />
                      {this.state.errors.Mother && <span className="error">{this.state.errors.Mother}</span>}
                  </Col>
              </Row>
           </FormGroup>
           <FormGroup >
          <Row>
            <Col>
             <Label className="name1">Relational of parent/Guardian <span class="required">*</span></Label>
            </Col>
             <Col className='lastcol'>
              <Input type="select" className='input1'  name="Relation" onClick={this.handlechange}>
                      <option value="">Select</option>
                      <option value="parent">Parent</option>
                      <option value="Guardian">Guardian</option>
              </Input >
               
              {this.state.errors.Relation && <span className="error">{this.state.errors.Relation}</span>}
                  </Col>
              
              </Row>
           </FormGroup> 
             
           <br/>
           <div>
           <button  class="btn btn-success" style={{width: "15%",
                                             marginLeft: "60%",
                                             }}>
      <Link className='link' onClick={this.handleSubmit} >Proceed</Link></button>
     <button  class="btn btn-danger" style={{width: "15%",
                                            marginLeft:"10px"
                                             }}>
      <Link className='link' to="/BonafidePage" >Back</Link></button>
      </div>
     <br/>
      </Card>
</div>
</Card>
      </div>
    )
  }
}
export default withAuthentication(Income);