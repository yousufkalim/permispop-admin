import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";

class AdminNavbarLinks extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      User: ""
    };
  }
componentWillMount()
{

  var y = localStorage.getItem("userdata");
  // console.log("y is",y);
  // console.log("props",this.props);
  if(y === null || y=== "")
  {
    this.props.history.history.push(`/`);
   } else {
    this.setState({User: JSON.parse(y) });
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
