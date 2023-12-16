import React, { Component } from 'react'
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./LoginPages/Login";
import Home from './Pages/Home';
import Income from './Pages/Income';
import Logout from './Pages/Logout';
import Scholarship from './Pages/Scholarship';
import Trainpass from './Pages/Trainpass';
import Passportrenewnal from './Pages/Passportrenewnal'
import Passport from './Pages/Passport'
import Awards from './Pages/Awards'
import Visa from './Pages/Visa'
import Bonafide from './Pages/Bonafide'
import BonafidePage from './Pages/BonefidePage'
import Parent from './Pages/Parent';
import Bus from './Pages/Bus';
import Others from './Pages/others';
import Personalstuding from './Pages/Personalstuding';
import Bankloan from './Pages/Bankloan';
import Jobapply from './Pages/Jobapply';



export default class App extends Component {
  render() {
    return (
      <div> 
        <BrowserRouter>
          <Routes>
            <Route  path="/" element={<Login />} />
            <Route  path="/Home" element={<Home />} />
            <Route  path="/Income" element={<Income/>} />
            <Route  path="/Logout" element={<Logout />} />
            <Route  path="/Scholarship" element={<Scholarship />} />
            <Route path="/Trainpass" element={<Trainpass />} />
            <Route path="/Bus" element={<Bus/>} />
            <Route path="/Passportrenewnal" element={<Passportrenewnal />} />
            <Route  path="/Passport" element={<Passport />} />
            <Route  path="/Awards" element={<Awards />} />
            <Route  path="/Visa" element={<Visa />} />
            <Route  path="/Bonafide" element={<Bonafide />} />
            <Route  path="/BonafidePage" element={<BonafidePage />} />
            <Route  path="/Parent" element={<Parent />} />
            <Route  path="/Income" element={<Income />} />
            <Route path="/Others" element={<Others />} />
            <Route path="/Personalstuding" element={<Personalstuding />} />
            <Route path="/bankloan" element={<Bankloan />} />
            <Route  path="/Jobapply" element={<Jobapply/>} />
            </Routes>
        </BrowserRouter>   
      </div>
    )
  }
}
