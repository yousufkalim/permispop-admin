import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";
import jwtDecode from "jwt-decode";
import { Base64 } from "js-base64";
import { Translation } from "react-i18next";

class AdminNavbarLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      User: "",
    };
  }
  componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    if (tokn === null || tokn === "") {
      // console.log("this.prop", this.props);
      window.location.replace("/login");
    } else {
      try {
        var decoded = jwtDecode(tokn);
        var y = JSON.parse(Base64.decode(decoded.userData));
        this.setState({ User: y });
      } catch (e) {
        alert(e);
        window.location.replace("/login");
      }
    }
  }

  onClick() {
    localStorage.setItem("userdata", "");
    localStorage.setItem("firstVisit", "");
  }

  render() {
    // const notification = (
    //   <div>
    //     <i className="fa fa-globe" />
    //     <b className="caret" />
    //     <span className="notification">5</span>
    //     <p className="hidden-lg hidden-md">Notification</p>
    //   </div>
    // );
    return (
      <Translation>
        {(t) => (
          <div>
            <Nav>
              <NavItem eventKey={1} href="#">
                <i className="fa fa-dashboard" />
                <p className="hidden-lg hidden-md">Dashboard</p>
              </NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">
                {t("Account")}
              </NavItem>
              <NavItem eventKey={3} href="/login">
                {t("Log out")}
                <i onClick={this.delData}></i>
              </NavItem>
            </Nav>
          </div>
        )}
      </Translation>
    );
  }
}

export default AdminNavbarLinks;
