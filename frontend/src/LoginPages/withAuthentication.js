import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'reactstrap';
import "../Styles/Bonafide.css";
import { Row, Col } from 'reactstrap';
import axios from "axios";
import { Navigate } from "react-router-dom";
import anna from "../Images/symbolanna.png";
import Cookies from 'js-cookie';

const withAuthentication = (WrappedComponent) => {
  return class extends Component {
    isAuthenticated() {
      // Implement your authentication logic here
      const accessToken = sessionStorage.getItem('accesstoken');
     
        return accessToken;
    }

    render() {
      if (this.isAuthenticated()) {
        return <WrappedComponent {...this.props} />;
      } else {
        // Redirect to the login page using Redirect
        return <Navigate to="/" />;
      }
    }
  };
};

export default withAuthentication;