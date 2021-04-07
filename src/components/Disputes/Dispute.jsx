import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import $ from "jquery";
import moment from "moment";
import { Button } from "antd";
import { motion } from "framer-motion";

class Dispute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disputeInfo: {},
      bInfo: {},
      sInfo: {},
      iInfo: {},
      status: "-1",
    };
  }
  WebServicesManager = new WebServicesManager();
  componentWillMount() {
    var tokn = localStorage.getItem("userdata");
    // console.log("props inner", this.props);
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Dispute/GetDispute",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (s, r) => {
        // console.log("r", r);
        this.setState({ disputeInfo: r[0] });
        this.WebServicesManager.getApiWithParamCall(
          {
            endPoint: "Bookings/GetBookingById",
            dataToFetch: r[0].bookingId,
            token: tokn,
          },
          (s, rb) => {
            this.setState({ bInfo: rb });
            // console.log(rb);
          }
        );

        this.WebServicesManager.getApiWithParamCall(
          {
            endPoint: "personal/GetAllById",
            dataToFetch: r[0].studentID,
            token: tokn,
          },
          (s, rs) => {
            this.setState({ sInfo: rs });
          }
        );

        this.WebServicesManager.getApiWithParamCall(
          {
            endPoint: "personal/GetAllById",
            dataToFetch: r[0].instructorID,
            token: tokn,
          },
          (s, ri) => {
            this.setState({ iInfo: ri });
          }
        );
      }
    );
  }
  handleStatusChange = (e) => {
    this.setState({ status: e.target.value });
  };
  submit = (e) => {
    var tokn = localStorage.getItem("userdata");
    if (this.state.status === "-1") alert("Please Select status");
    else
      this.WebServicesManager.getApiWithParamCall(
        {
          endPoint: "Dispute/UpdateDisputeStatus",
          dataToFetch:
            this.props.id +
            "&status=" +
            this.state.status +
            "&cmt=" +
            $("#txtCmt").val(),
          token: tokn,
        },
        (s, r) => {
          // console.log("drispuet r",r);
          if (this.state.status === "Student Suspended") {
            // debugger;
            this.deactivateUser(this.state.sInfo.id);
          } else if (this.state.status === "Instructor Suspended") {
            this.deactivateUser(this.state.IInfo.id);
          } else {
            this.props.toggle();
            window.location.reload();
          }
        }
      );
  };
  deactivateUser = (id) => {
    // debugger;
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: id,
        token: tokn,
      },
      (statusCode, resp) => {
        const profiledataUnban = {
          id: resp.id,
          role: resp.role,
          PersonalInfoId: resp.personalInfoId,
          DrivingLisenceInfoId: resp.drivingLisenceInfoId,
          ExersiceAuthorizationInfoId: resp.exersiceAuthorizationInfoId,
          VehicleDetailInfoId: resp.vehicleDetailInfoId,
          VehicleInsuranceInfoId: resp.vehicleInsuranceInfoId,
          DrivingSchoolInsuranceInfoId: resp.drivingSchoolInsuranceInfoId,
          TechnicalControlInfoId: resp.technicalControlInfoId,
          BusinessInfoId: resp.businessInfoId,
          InsuranceCompanyInfoId: resp.insuranceCompanyInfoId,
          DrivingSchoolIdentityInfoId: resp.drivingSchoolIdentityInfoId,
          DrivingSchoolApprovalInfoId: resp.drivingSchoolApprovalInfoId,
          DrivingSchoolManagerInfoId: resp.drivingSchoolManagerInfoId,
          DrivingSchoolVehiclesInfoId: resp.drivingSchoolVehiclesInfoId,
          DrivingSchoolInstructorInfoId: resp.drivingSchoolInstructorInfoId,
          Lat: resp.lat,
          Long: resp.long,
          Status: resp.status,
          BanStatus: "DeActive",
          BanDate: "",
        };
        // debugger;
        var dataTo = JSON.stringify(profiledataUnban);
        this.WebServicesManager.postApiCall(
          {
            endPoint: "Profile/UpdateProfile",
            dataToInsert: dataTo,
            token: tokn,
          },
          (statusCode, response) => {
            this.props.toggle();
            window.location.reload();
          }
        );
      }
    );
  };
  activateUser = (id) => {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: id,
        token: tokn,
      },
      (statusCode, resp) => {
        const profiledataUnban = {
          id: resp.id,
          role: resp.role,
          PersonalInfoId: resp.personalInfoId,
          DrivingLisenceInfoId: resp.drivingLisenceInfoId,
          ExersiceAuthorizationInfoId: resp.exersiceAuthorizationInfoId,
          VehicleDetailInfoId: resp.vehicleDetailInfoId,
          VehicleInsuranceInfoId: resp.vehicleInsuranceInfoId,
          DrivingSchoolInsuranceInfoId: resp.drivingSchoolInsuranceInfoId,
          TechnicalControlInfoId: resp.technicalControlInfoId,
          BusinessInfoId: resp.businessInfoId,
          InsuranceCompanyInfoId: resp.insuranceCompanyInfoId,
          DrivingSchoolIdentityInfoId: resp.drivingSchoolIdentityInfoId,
          DrivingSchoolApprovalInfoId: resp.drivingSchoolApprovalInfoId,
          DrivingSchoolManagerInfoId: resp.drivingSchoolManagerInfoId,
          DrivingSchoolVehiclesInfoId: resp.drivingSchoolVehiclesInfoId,
          DrivingSchoolInstructorInfoId: resp.drivingSchoolInstructorInfoId,
          Lat: resp.lat,
          Long: resp.long,
          Status: resp.status,
          BanStatus: "",
          BanDate: "",
        };
        var dataTo = JSON.stringify(profiledataUnban);
        this.WebServicesManager.postApiCall(
          {
            endPoint: "Profile/UpdateProfile",
            dataToInsert: dataTo,
            token: tokn,
          },
          (statusCode, response) => {
            console.log("update", response);
            this.props.toggle();
            window.location.reload();
          }
        );
      }
    );
  };
  render() {
    return (
      <div className="content">
        <div
          style={{
            float: "left",
            margin: "-20px 0px 6px 20px",
          }}
        >
          <motion.div
            title="Go Back"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            style={{
              position: "relative",
              zIndex: "1000",
            }}
            onClick={this.props.toggle}
          >
            <a href="/admin/disputes">
              <i
                className="fas fa-arrow-left fa-2x"
                style={{ color: "#149e7a" }}
              ></i>
            </a>
          </motion.div>
        </div>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Take Action"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Grid>
                    <Row>
                      <Col md={10}>
                        Change Status:{" "}
                        <select
                          className="form-control"
                          onChange={this.handleStatusChange}
                        >
                          <option value="-1"></option>
                          <option value="Open">Open </option>
                          <option value="Closed">Closed </option>
                          <option value="Student Suspended">
                            Student Suspended{" "}
                          </option>
                          <option value="Intructor Suspended">
                            Instructor Suspended{" "}
                          </option>
                        </select>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col md={5}>
                        Comments:{" "}
                        <textarea
                          className="form-control"
                          rows="3"
                          id="txtCmt"
                        ></textarea>
                      </Col>
                      <Col md={5}>
                        <Button
                          id="btnSubmit"
                          onClick={this.submit}
                          style={{ marginTop: 30 }}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                    <br />
                    <br />
                    <b>Status</b>: {this.state.disputeInfo.status}
                    {this.state.disputeInfo.status === "Student Suspended" ? (
                      <Button
                        onClick={() => this.activateUser(this.state.sInfo.id)}
                        style={{ marginLeft: 20 }}
                      >
                        Activate Student
                      </Button>
                    ) : this.state.disputeInfo.status ===
                      "Instructor Suspended" ? (
                      <Button
                        onClick={() => this.activateUser(this.state.iInfo.id)}
                        style={{ marginLeft: 20 }}
                      >
                        Activate Instructor
                      </Button>
                    ) : (
                      ""
                    )}
                    <br />
                    <b>Admin Comment</b>: {this.state.disputeInfo.adminComments}
                  </Grid>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card
                title="Dispute Details"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Grid>
                    <Row>
                      <Col md={6}>
                        Date:{" "}
                        {moment(this.state.disputeInfo.feedBackDate).format(
                          "DD/MM/YYYY"
                        )}
                      </Col>
                      <Col md={6}>
                        Raised From: {this.state.disputeInfo.disputingFrom}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        Dispute : {this.state.disputeInfo.dispute}
                      </Col>
                      <Col md={6}>
                        Comments : {this.state.disputeInfo.comment}
                      </Col>
                    </Row>
                  </Grid>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card
                title="Booking Details"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Grid>
                    <Row>
                      <Col md={4}>
                        Date:{" "}
                        {moment(this.state.bInfo.bookingDate).format(
                          "DD/MM/YYYY"
                        )}
                      </Col>
                      <Col md={4}>Start Time: {this.state.bInfo.startTime}</Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        End Time :{" "}
                        {moment(this.state.bInfo.endTime).format("HH:mm")}
                      </Col>
                    </Row>
                  </Grid>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card
                title="Student"
                category=""
                ctTableFullWidth
                ctTableResponsive
                bg={
                  this.state.disputeInfo.disputingFrom === "Student"
                    ? "lightgreen"
                    : "orange"
                }
                content={
                  <div className="content">
                    <li className="fa fa-user" />
                    {this.state.sInfo.firstName +
                      " " +
                      this.state.sInfo.surName}
                    <hr />
                    <li className="fa fa-envelope" />
                    {this.state.sInfo.email}
                    <hr />
                    <li className="fa fa-phone" />
                    {this.state.sInfo.phone}
                    <hr />
                    <li className="fa fa-building" />
                    {this.state.sInfo.city} <span> {this.state.sInfo.zip}</span>
                    <br />
                    <li className="fa fa-map" />
                    {this.state.sInfo.address}
                  </div>
                }
              />
            </Col>
            <Col md={6}>
              <Card
                title="Instructor"
                category=""
                ctTableFullWidth
                ctTableResponsive
                bg={
                  this.state.disputeInfo.disputingFrom === "Student"
                    ? "orange"
                    : "lightgreen"
                }
                content={
                  <div className="content">
                    <li className="fa fa-user" />
                    {this.state.iInfo.firstName +
                      " " +
                      this.state.iInfo.surName}
                    <hr />
                    <li className="fa fa-envelope" />
                    {this.state.iInfo.email}
                    <hr />
                    <li className="fa fa-phone" />
                    {this.state.iInfo.phone}
                    <hr />
                    <li className="fa fa-building" />
                    {this.state.iInfo.city} <span> {this.state.iInfo.zip}</span>
                    <br />
                    <li className="fa fa-map" />
                    {this.state.iInfo.address}
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dispute;
