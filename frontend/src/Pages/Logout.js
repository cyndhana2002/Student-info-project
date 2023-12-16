import React, { Component } from "react";
import { Navigate } from "react-router-dom";
class Logout extends Component {
  state = {
    accesstoken: sessionStorage.getItem('accesstoken'),
    Student_roll: sessionStorage.getItem('Student_roll'),
  }
  logout = () => {
    console.log("Logging out...");
    sessionStorage.removeItem('accesstoken');
    sessionStorage.removeItem('Student_roll');
    console.log("Tokens removed from session storage.");
  };

  componentDidMount() {
    this.logout();
  }
  render() {
    return (
      <div>
        <Navigate to="/" />
      </div>
    );
  }
}
export default Logout;
