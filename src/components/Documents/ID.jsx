import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import DrivingLicense from "components/Documents/DrivingLicense";
import IDCard from "components/Documents/IDCard.jsx";
import AOE from "components/Documents/AOE.jsx";
import Siret from "components/Documents/Siret.jsx";
import VehicleRegistration from "components/Documents/VehicleDetails.jsx";
import VehicleInsurance from "components/Documents/VehicleInsurance.jsx";
import DrivingSchoolApproval from "components/Documents/DrivingSchoolApproval.jsx";
import RCPro from "components/Documents/RCPro.jsx";

class ID extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      frontIdPath: this.props.frontIDPhoto,
      frontIdPathError: "",
      backIdPath: this.props.backIDPhoto,
      drivingLicanceImg: "",
    };
  }

  updateStatus = (e) => {
    var tokn = localStorage.getItem("userdata");
    var statusis = false;

    if (e === undefined) {
      statusis = this.state.status !== "" ? true : false;
    } else {
      statusis = e.target.checked;
    }
    // debugger;
    var lengthToMatch;
    if (this.props.role === "Student" || this.props.role === "student") {
      lengthToMatch = 2;
    } else if (this.props.role === "Instructor") {
      lengthToMatch = 7;
    } else if (this.props.role === "DSInstructor") {
      lengthToMatch = 5;
    } else {
      lengthToMatch = 4;
    }

    const info = {
      userId: this.props.personalInfoId,
      documentName: this.props.Type,
      status: statusis,
      comments: "",
    };
    this.setState({ status: statusis });
    var dataToInsert = JSON.stringify(info);
    this.WebServicesManager.postApiCall(
      {
        endPoint: "Document",
        dataToInsert: dataToInsert,
        token: tokn,
      },
      (statusCode, response) => {
        this.WebServicesManager.getApiWithParamCall(
          {
            endPoint: "Document/GetUserDoc",
            dataToFetch: this.props.personalInfoId,
            token: tokn,
          },
          (statusCode, responsePersonalDoc) => {
            var docVarify = true;
            if (responsePersonalDoc.length >= lengthToMatch) {
              responsePersonalDoc.map((item) => {
                if (item.status !== "true") {
                  docVarify = false;
                }
              });
            } else if (responsePersonalDoc.length === 0) {
              docVarify = false;
            } else {
              docVarify = false;
            }
            var mail_sent = true;
            if (docVarify === true) {
              this.WebServicesManager.getApiWithParamCall(
                {
                  endPoint: "Personal/GetAllById",
                  dataToFetch: this.props.personalInfoId,
                  token: tokn,
                },
                (statusCode, responsePersonal) => {
                  if (responsePersonal.documentTested !== "Tested") {
                    mail_sent = false;
                  }
                  const perobj = {
                    ...responsePersonal,
                    documentTested: "Tested",
                  };

                  this.WebServicesManager.postApiCall(
                    {
                      endPoint: "Personal/UpdatePersonal",
                      dataToInsert: JSON.stringify(perobj),
                      token: tokn,
                    },
                    (statusCode, Resp) => {
                      console.log("Resp", Resp);
                      if (mail_sent === false) {
                        this.WebServicesManager.getApiWithParamCall(
                          {
                            endPoint: "Personal/SendEmail",
                            dataToFetch: Resp.id + "&email=" + Resp.email,
                            token: tokn,
                          },
                          (statusCode, EResp) => {
                            console.log("data", EResp);
                            alert(
                              "All document Verified, mail sent successfully"
                            );
                          }
                        );
                      }
                    }
                  );
                }
              );
            } else {
              this.WebServicesManager.getApiWithParamCall(
                {
                  endPoint: "Personal/GetAllById",
                  dataToFetch: this.props.personalInfoId,
                  token: tokn,
                },
                (statusCode, responsePersonal) => {
                  const perobj = {
                    ...responsePersonal,
                    documentTested: "",
                  };

                  this.WebServicesManager.postApiCall(
                    {
                      endPoint: "Personal/UpdatePersonal",
                      dataToInsert: JSON.stringify(perobj),
                      token: tokn,
                    },
                    (statusCode, Resp) => {
                      console.log("Resp", Resp);
                    }
                  );
                }
              );
            }
          }
        );
        this.props.retunfb();
      }
    );
  };

  componentWillMount() {
    this.setState(
      { status: this.props.status === "true" ? "checked" : "" },
      () => {
        this.updateStatus();
      }
    );
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              {this.props.Type === "fic" || this.props.Type === "bic" ? (
                <IDCard {...this.props} />
              ) : (
                ""
              )}
              {this.props.Type === "drvlic" ? (
                <DrivingLicense {...this.props} />
              ) : (
                ""
              )}
              {this.props.Type === "aoe" ? <AOE {...this.props} /> : ""}
              {this.props.Type === "kbl" ? <Siret {...this.props} /> : ""}
              {this.props.Type === "greenCard" ? (
                <VehicleInsurance {...this.props} />
              ) : (
                ""
              )}
              {this.props.Type === "vReg" ? (
                <VehicleRegistration {...this.props} imgType="reg" />
              ) : (
                ""
              )}
              {String(this.props.Type).includes("veh") ? (
                <VehicleRegistration {...this.props} />
              ) : (
                ""
              )}
              {this.props.Type === "dsa" ? (
                <DrivingSchoolApproval {...this.props} />
              ) : (
                ""
              )}
              {this.props.Type === "rc" ? <RCPro {...this.props} /> : ""}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              Not Verified
              <label className="switch">
                <input
                  type="checkbox"
                  checked={this.state.status}
                  onChange={this.updateStatus}
                />
                <span className="slider round"></span>
              </label>{" "}
              Verified
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ID;

// handleCHange = e =>{
//     this.setState({[e.target.name]:e.target.value})
// }
