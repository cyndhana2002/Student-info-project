import React, { Component } from 'react';
import "./Login.css";
import { Button, FormGroup, Form, Input,Card } from "reactstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Staffs from "../Images/anna.png";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "../Pages/Home"
import anna from "../Images/symbolanna.png"
import Cookies from 'js-cookie'


export default class login extends Component {
  state = {
    ispassword: false,
    username: "",
    password: "",
    usernameErr: "",
    passwordErr: "",
    err: 0,
    access: false,
    login: false,
    token: null,
    errors: {
      username:'',
     password:'',
    }
  }

  togglePassword = () => {
    const { ispassword } = this.state;
    this.setState({ ispassword: !ispassword });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    // Validate the fields and update errors
    if (!username) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          username: 'This field is required.',
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          username: '',
        },
      }));
    }
  
    if (!password) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          password: 'This field is required.',
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          password: '',
        },
      }));
    }
  
 
  
    // If any error exists, return without submitting the form
    if (!username || !password ) {
      return;
    }
    const value = {
      username: this.state.username,
      password: this.state.password,
    };

    try {
      const res = await axios.post("http://localhost:8000/create", value);
      const { token } = res.data;

      // Store the token in a cookie
      Cookies.set('token', token);
      if (res.data.token) {
        sessionStorage.setItem("accesstoken", res.data.token);
     
      }
      this.setState({ login: true ,token:this.state.token});
    } catch (err) {
      console.error("Request failed:", err);
      this.setState({ err: 1, login: false });
    }
  };

  // addUserValidation = () => {
  //   let hasErr = true;
  //   let usernameErr = "";
  //   let passwordErr = "";

  //   if (this.state.username === "") {
  //     usernameErr = "This field is required";
  //     this.setState({ usernameErr });
  //     hasErr = false;
  //   }

  //   if (this.state.password === "") {
  //     passwordErr = "This field is required";
  //     this.setState({ passwordErr });
  //     hasErr = false;
  //   }

  //   return hasErr;
  // };
  render() {
    return(
      <div>
        {this.state.login ? (
          <Navigate to="/Home" />
      
    ) : (
          <div>
            <Card className='outer' style={{ height: "700px" }}>
              <div className="containers">
                <br /><br />
                <Card className='innerlogo'>
                  <div>
                    <Row>
                      <Col className='annaimagecol'>
                        <img src={anna} className="annaimag" />
                      </Col><Col className='annaformat'>
                        <br />
                        <h3>COLLEGE OF ENGINEERING GUINDY,</h3>
                        <h3>ANNA UNIVERSITY , CHENNAI-600 025</h3></Col>
                    </Row>
                  </div>
                </Card>
                <div class="rows">
                  <div class="login_form" >
                    <h1>Welcome!</h1>
                    <h3>Login to your Account</h3>
                    {this.state.err ? (
                      <label
                        align="center"
                        style={{ color: "red", fontSize: 16, marginTop: -50 }}
                      >
                        Invalid Credentials
                      </label>
                    ) : null}
                  
  
                    <FormGroup >
                      
                      <label className="username">Username  <span class="required">*</span></label>{this.state.errors.username && <span className="error">{this.state.errors.username}</span>}
                      <Input
                        className="input1"
                        type="text"
                        placeholder="Enter your username"
                        required
                        value={this.state.username}
                        onChange={(e) =>
                          this.setState({
                            username: e.target.value,
                            usernameErr: "",
                          })
                        }
                      />
                        
                     
                    </FormGroup>
           

                    <FormGroup >
                      <label className="password">Password  <span class="required">*</span></label>{this.state.errors.password && <span className="error">{this.state.errors.password}</span>}
                      <Input
                        className="input1"
                        type={this.state.ispassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        value={this.state.password}
                        onChange={(e) =>
                          this.setState({
                            password: e.target.value,
                            passwordErr: "",
                          })
                        }
                      />
                      {this.state.ispassword ? (
                        <AiFillEyeInvisible
                          className="password-icon"
                          onClick={this.togglePassword}
                        />
                      ) : (
                        <AiFillEye
                          className="password-icon"
                          onClick={this.togglePassword}
                        />
                      )}
                       
                    </FormGroup>
                    <Button className='loginButton' onClick={this.handleSubmit}>Login</Button>

                  </div>
                  <div class="images">
                    <img className="Staffimg" src={Staffs}
                      alt="Staffimg" />

                  </div>
                </div>
              </div>
              <br />
            </Card>
          </div>
        
        )}
        </div>
      )
    }
  }
  
