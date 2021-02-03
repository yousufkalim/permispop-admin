import React, { Component } from "react";
import { Grid, Row, Col, Tabs, Tab, TabContainer } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import UserCard from "components/UserCard/UserCard.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import UserDocuments from "components/UserCard/UserDocuments.jsx";
import UserPayments from "components/UserCard/UserPayments.jsx";
import UserInstructors from "components/UserCard/UserInstructors.jsx";
import UserMeetups from "components/UserCard/UserMeetups.jsx";
import "font-awesome/css/font-awesome.min.css";
import { MDBDataTable } from "mdbreact";

const $ = require("jquery");
$.DataTable = require("datatables.net");

const columns = [
  {
    label: "#",
    field: "key",
    sort: "asc",
    width: 150,
  },
  {
    label: "Name",
    field: "name",
    sort: "asc",
    width: 270,
  },
  {
    label: "Role",
    field: "role",
    sort: "asc",
    width: 200,
  },
  {
    label: "Active",
    field: "active",
    sort: "asc",
    width: 100,
  },
  {
    label: "Document Verfied",
    field: "docV",
    sort: "asc",
    width: 150,
  },
  {
    label: "View Details",
    field: "details",
    sort: "asc",
    width: 100,
  },
];

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      nonVarifiedUser: [],
      verfiedUser: [],
      users: [],
      showDetails: false,
      userDetails: {},
      documentVerified: "",
      dataV: {},
      dataNV: {},
      defualtTab: "documents",
    };
  }
  WebServicesManager = new WebServicesManager();
  handleClick(obj) {
    this.setState({ showDetails: !this.state.showDetails, userDetails: obj });
  }
  componentWillMount() {
    var nonVerified = [];
    var verfied = [];
    var VerifiedUser = [];
    var NonVerifiedUser = [];
    var vc = 1,
      nvc = 1;
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "Personal/GetAllUsers",
        token: tokn,
      },
      (statusCode, response) => {
        // console.log("r",r);
        response.map((item) => {
          if (
            item.role !== "Admin" &&
            item.role !== "Email" &&
            item.role !== "DSInstructor" &&
            !item.role.includes("Delete")
          ) {
            if (item.documentTested === "Tested") {
              VerifiedUser.push({
                key: vc,
                name: item.firstName + " " + item.surName,
                role: item.role,
                active: (
                  <i className="fa fa-check" style={{ color: "green" }}></i>
                ),
                docV: (
                  <i className="fa fa-check" style={{ color: "green" }}></i>
                ),
                details: (
                  <span onClick={() => this.handleClick(item)} id={item.id}>
                    <li className="fa fa-eye fa-2x" title="View More"></li>
                  </span>
                ),
                clickEvent: () => this.handleClick(item),
              });
              vc = vc + 1;
            } else {
              NonVerifiedUser.push({
                key: nvc,
                name: item.firstName + " " + item.surName,
                role: item.role,
                active: (
                  <i className="fa fa-check" style={{ color: "green" }}></i>
                ),
                docV: <i className="fa fa-remove" style={{ color: "red" }}></i>,
                details: (
                  <span onClick={() => this.handleClick(item)} id={item.id}>
                    <li className="fa fa-eye fa-2x" title="View More"></li>
                  </span>
                ),
                clickEvent: () => this.handleClick(item),
              });
              nvc = nvc + 1;
            }
          }
        });
        var verifiedUserData = { columns: columns, rows: VerifiedUser };
        var nonVerifiedUserData = { columns: columns, rows: NonVerifiedUser };
        this.setState(
          {
            allUsers: response,
            verfiedUser: verfied,
            nonVarifiedUser: nonVerified,
            dataV: verifiedUserData,
            dataNV: nonVerifiedUserData,
          },
          () => {
            setTimeout(() => {
              var link_id = this.props.location.user_id;
              if (link_id !== undefined) {
                // var element = document.getElementById("5fec10f2f4d2a1176c70a0f6");
                var element = document.getElementById(link_id);
                if (element !== null) {
                  element.click();
                }
              }
            }, 100);
          }
        );
      }
    );
  }
  componentDidMount() {}

  changeUser = (id) => {
    var token = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Personal/GetAllById",
        dataToFetch: id,
        token,
      },
      (statusCode, responseUser) => {
        this.setState({ userDetails: responseUser, defualtTab: "documents" });
      }
    );
  };

  render() {
    return (
      <div className="content">
        <Grid fluid>
          {this.state.showDetails ? (
            <Row>
              <Row>
                <Col md={12}>
                  <a href="#" onClick={() => window.location.reload()}>
                    {" "}
                    <i className="fa fa-arrow-circle-left"></i>Back to list
                  </a>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <UserCard
                    bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                    {...this.state.userDetails}
                  />
                  {console.log("...this.state.userDetails", {
                    ...this.state.userDetails,
                  })}
                </Col>
                <Col md={8}>
                  <Card
                    title=""
                    category=""
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <TabContainer className="content">
                        <Tabs defaultActiveKey={this.state.defualtTab}>
                          <Tab eventKey="documents" title="Documents" id="1">
                            <UserDocuments {...this.state.userDetails} />
                          </Tab>

                          {/* instructor tabs */}
                          {this.state.userDetails.role === "DrivingSchool" ? (
                            <Tab
                              eventKey="instructor"
                              title="Instructor"
                              id="3"
                            >
                              <UserInstructors
                                {...this.state.userDetails}
                                changeUser={this.changeUser}
                              />
                            </Tab>
                          ) : (
                            ""
                          )}
                          {/* meetup tabs */}
                          {this.state.userDetails.role === "Instructor" ||
                          this.state.userDetails.role === "DSInstructor" ||
                          this.state.userDetails.role === "CarRentalAgent" ? (
                            <Tab eventKey="meetup" title="Meetup Points" id="4">
                              <UserMeetups {...this.state.userDetails} />
                            </Tab>
                          ) : (
                            ""
                          )}
                          <Tab eventKey="Payments" title="Payments" id="2">
                            <UserPayments {...this.state.userDetails} />
                          </Tab>
                        </Tabs>
                      </TabContainer>
                    }
                  />
                </Col>
              </Row>
            </Row>
          ) : (
            <Row>
              <Col md={12}>
                <Card
                  title="Users"
                  category=""
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Tabs
                      defaultActiveKey="inactiveuser"
                      id="noanim-tab-example"
                    >
                      <Tab eventKey="inactiveuser" title="Non Verified">
                        <Row
                          className="table-responseive"
                          style={{ margin: 10 }}
                        >
                          <MDBDataTable
                            bordered
                            data={this.state.dataNV}
                            className="dataTableNew"
                          />
                        </Row>
                      </Tab>
                      <Tab eventKey="verfied" title="Verified">
                        <Row
                          className="table-responseive"
                          style={{ margin: 10 }}
                        >
                          <MDBDataTable
                            bordered
                            data={this.state.dataV}
                            className="dataTableNew"
                          />
                        </Row>
                      </Tab>
                    </Tabs>
                  }
                />
              </Col>
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}

export default Users;
