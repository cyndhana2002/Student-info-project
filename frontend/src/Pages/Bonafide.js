import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'reactstrap'
import "../Styles/Bonafide.css"
import { Row, Col } from 'reactstrap'
import axios from "axios";
import { Navigate } from "react-router-dom";
import anna from "../Images/symbolanna.png"
import Cookies from 'js-cookie'
import withAuthentication from "../LoginPages/withAuthentication"
 class Bonafide extends Component {
  state = {
    Student_roll: '',
    login: false,
    accesstoken: sessionStorage.getItem('accesstoken'),
    studentname: '',
    branch: '',
    time: '',
    degree: '',
    semester: '',
    year: '',
    academicYearLabel: '',
    gender: '',
    err:0,
    errors: {
     Student_roll:''
    },
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { Student_roll } = this.state;

    if (!Student_roll) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Student_roll: 'This field is required.',
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          Student_roll: '',
        },
      }));
    }

    if (!Student_roll ) {
      return;
    }
    const value = {
      Student_roll: Number(this.state.Student_roll)
    };
  
    try {
      const token = Cookies.get('token');
      const headers = {
        'Content-Type': 'application/json',
        cookie: `token=${this.state.accesstoken}`,
      };
  
      console.log('token', token);
      const res = await axios.post('http://localhost:8000/Bonafide/student', value, { headers, withCredentials: true });
      console.log(res.data.data.time)
      if (res.data.studentname) {
        sessionStorage.setItem('studentname', res.data.data.studentname);
        console.log(res.data.studentname)
      }
      if (res.data.semester) {
        sessionStorage.setItem('semester', res.data.data.currentSemester.currentSemesterLabel);
      }
      if (res.data.year) {
        sessionStorage.setItem('year',  res.data.data.currentSemester.year);
      }
      if (res.data.degree) {
        sessionStorage.setItem('degree', res.data.data.degree);
      }
      if (res.data.branch) {
        sessionStorage.setItem('branch', res.data.data.branch);
      }
      if (res.data.time) {
        sessionStorage.setItem('time', res.data.data.time);
        
      }
      if (res.data.academicYearLabel) {
        sessionStorage.setItem('academic', res.data.currentSemester.academicYearLabel);
      
      }
      if (res.data.gender) {
        sessionStorage.setItem('academic', res.data.data.gender);
      
      }
  
      this.setState({
        login: true,
        Student_roll: sessionStorage.setItem('Student_roll', this.state.Student_roll),
        time: sessionStorage.setItem('time', res.data.data.time),
        branch: sessionStorage.setItem('branch', res.data.data.branch),
        degree: sessionStorage.setItem('degree', res.data.data.degree),
        year: sessionStorage.setItem('year', res.data.data.currentSemester.year),
        semester: sessionStorage.setItem('semester', res.data.data.currentSemester.currentSemesterLabel),
        studentname: sessionStorage.setItem('studentname', res.data.data.studentname),
        academic: sessionStorage.setItem('academic', res.data.data.currentSemester.academicYearLabel),
        gender: sessionStorage.setItem('gender', res.data.data.gender),
      });
    } catch (err) {
      console.error('Request failed:', err);
      this.setState({ err:1,login: false });
    }
  };
  render() {
    return this.state.login ? (
      <Navigate to="/BonafidePage" replace={true} />
    ):(
      <div>
         <Card className='outer'style={{height:"700px"}}>
         <div className="containers">
        <br/><br/>
         
          <Card className='innerlogo'>
        <div>
          <Row>
            <Col className='annaimagecol'>
        <img src={anna}  className="annaimag"/>
        </Col><Col className='annaformat1'>
          <br/>
      <h3>COLLEGE OF ENGINEERING GUINDY,</h3>
      <h3>ANNA UNIVERSITY , CHENNAI-600 025</h3></Col>
      </Row>
      </div>
      </Card>
     
      <Card className='centercard' style={{backgroundColor:"rgb(237, 233, 233)"}}>
                <br />
                {this.state.err ? (
                      <label
                        align="center"
                        style={{ color: "red", fontSize: 16, marginTop: -50 }}
                      >
                        Invalid Student!
                      </label>
                    ) : null}
                <div className='bonefide'>
               
          <label className='rollno'>Roll No <span class="required">*</span></label> 
          <input className='input' type="text"  value={this.state.Student_roll} onChange={(data)=>{this.setState({Student_roll:data.target.value})}}/>
          {this.state.errors.Student_roll && <span className="error">{this.state.errors.Student_roll}</span>}
       </div>
       
      
      <button class="btn btn-primary" className="proceed"onClick={this.handleSubmit}><Link className='link' >Proceed</Link></button>
     
     <br/>
     <button  class="btn btn-danger" className="logout" >
      <Link className='link' to="/Logout" >logout</Link></button>
     <br/>
      </Card>
</div>
</Card>
      </div>
    )
  }
}
export default withAuthentication(Bonafide);