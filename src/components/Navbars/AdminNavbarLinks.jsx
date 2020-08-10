import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import {Redirect} from "react-router-dom"
import jwtDecode from "jwt-decode";
import {Base64} from "js-base64";


class AdminNavbarLinks extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      User: ""
    };
  }
componentDidMount()
{
  var tokn = localStorage.getItem("userdata");
  if(tokn === null || tokn=== "")
    {
    console.log("this.prop",this.props)
    window.location.replace('/login');
   } else {
     try{
      var decoded = jwtDecode(tokn);
      var y = JSON.parse(Base64.decode(decoded.userData));
      this.setState({User: y });
     }catch(e){
       alert(e);
       window.location.replace('/login');
     }
  }
}

onClick() {
  localStorage.setItem("userdata", "");
  localStorage.setItem("firstVisit","");
}


  render() {
    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">5</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );
    return (
      <div>
        <Nav>
          <NavItem eventKey={1} href="#">
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            Account
          </NavItem>
          <NavItem eventKey={3} href="/login">
          Log out
            <i onClick={this.delData}></i>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
