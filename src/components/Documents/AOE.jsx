import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Modal,
  Button,
  FormControl,
  ControlLabel,
  FormGroup,
} from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import moment from "moment";

class AOE extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      aoe: {},
      authorizationImagePath: "",
      authorizationDate: "",
      expirationDate: "",
      issuingAuthority: "",
      showModalUpdate: false,
    };
  }
  componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    // if (this.props.role === "DSInstructor") {
    //   const response = JSON.parse(this.props.exersiceAuthorizationInfoId);
    //   this.setState({
    //     aoe: response,
    //     authorizationImagePath: response.authorizationImagePath,
    //     authorizationDate: response.authorizationDate,
    //     expirationDate: response.expirationDate,
    //     issuingAuthority: response.issuingAuthority,
    //   });
    // } else {
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "ExersiceAuthorization/GetExersiceAuthorityByUserId",
        dataToFetch: this.props.exersiceAuthorizationInfoId,
        token: tokn,
      },
      (statusCode, response) => {
        if (response !== null) {
          this.setState({
            aoe: response,
            authorizationImagePath: response.authorizationImagePath,
            authorizationDate: response.authorizationDate,
            expirationDate: response.expirationDate,
            issuingAuthority: response.issuingAuthority,
          });
        }
      }
    );
    // }
  }

  handleModelShow = () => {
    this.setState({ showModalUpdate: !this.state.showModalUpdate });
  };

  handleFrontFileSelect = (e) => {
    if (
      e.target.files[0] !== "" ||
      e.target.files[0] !== null ||
      e.target.files[0] !== undefined
    ) {
      this.setState({ authorizationImagePath: e.target.files[0].name });
      const imagedata = e.target.files[0];
      const Picture = new FormData();
      Picture.append("file", imagedata);
      this.WebServicesManager.postApiImageCall(
        {
          endPoint: "Personal/UploadProfileImage",
          dataToInsert: Picture,
        },
        (statusCode, response) => {
          // this.state.ImagePath =
          this.setState({
            authorizationImagePath: response,
          });
        }
      );
    } else {
      console.log("file is null");
    }
  };

  handleSave = () => {
    var tokn = localStorage.getItem("userdata");
    console.log("save");
    // save login will go here
    // if (this.props.role === "DSInstructor") {
    //   const perobj = {
    //     id: this.props.exersiceAuthorizationInfoId,
    //     authorizationDate: this.state.authorizationDate,
    //     issuingAuthority: this.state.issuingAuthority,
    //     expirationDate: this.state.expirationDate,
    //     authorizationImagePath: this.state.authorizationImagePath,
    //     folder: `${this.props.id}`,
    //     // folder:`${this.props.id}_${this.props.firstName}_${this.props.surName}`,
    //   };
    //   this.WebServicesManager.getApiWithParamCall(
    //     {
    //       endPoint: "Profile/GetProfileByPersonalId",
    //       dataToFetch: this.props.personalInfoId,
    //       token: tokn,
    //     },
    //     (statusCode, response) => {
    //       // get all detail and reassign
    //       const info = {
    //         id: response.id,
    //         role: response.role,
    //         PersonalInfoId: response.personalInfoId,
    //         DrivingLisenceInfoId: response.drivingLisenceInfoId,
    //         ExersiceAuthorizationInfoId: JSON.stringify(perobj),
    //         VehicleDetailInfoId: response.VehicleDetailInfoId,
    //         VehicleInsuranceInfoId: response.vehicleInsuranceInfoId,
    //         DrivingSchoolInsuranceInfoId: response.drivingSchoolInsuranceInfoId,
    //         TechnicalControlInfoId: response.technicalControlInfoId,
    //         BusinessInfoId: response.businessInfoId,
    //         InsuranceCompanyInfoId: response.insuranceCompanyInfoId,
    //         DrivingSchoolIdentityInfoId: response.drivingSchoolIdentityInfoId,
    //         DrivingSchoolApprovalInfoId: response.drivingSchoolApprovalInfoId,
    //         DrivingSchoolManagerInfoId: response.drivingSchoolManagerInfoId,
    //         DrivingSchoolVehiclesInfoId: response.DrivingSchoolVehiclesInfoId,
    //         DrivingSchoolInstructorInfoId:
    //           response.drivingSchoolInstructorInfoId,
    //         Lat: response.lat,
    //         Long: response.long,
    //         Status: response.status,
    //         BanStatus: response.banStatus,
    //         BanDate: response.banDate,
    //       };
    //       const dataToUpdate = JSON.stringify(info);
    //       this.WebServicesManager.postApiCall(
    //         {
    //           endPoint: "Profile/UpdateProfile",
    //           dataToInsert: dataToUpdate,
    //           token: tokn,
    //         },
    //         (statusCode, response) => {
    //           console.log("after update", response);
    //           window.location.reload();
    //         }
    //       );
    //     }
    //   );
    // } else {
    const perobj = {
      id: this.props.exersiceAuthorizationInfoId,
      AuthorizationDate: this.state.authorizationDate,
      IssuingAuthority: this.state.issuingAuthority,
      ExpirationDate: this.state.expirationDate,
      AuthorizationImagePath: this.state.authorizationImagePath,
      Folder: `${this.props.id}`,
      // Folder: `${this.props.id}_${this.props.firstName}_${this.props.surName}`,
    };
    this.WebServicesManager.postApiCall(
      {
        endPoint: "ExersiceAuthorization/UpdateExersiceAuthorization",
        dataToInsert: JSON.stringify(perobj),
        token: tokn,
      },
      (statusCode, Resp) => {
        console.log("Resp", Resp);
        window.location.reload();
      }
    );
    // }
  };

  render() {
    return (
      <>
        <Grid fluid>
          <Row>
            <Col md={6} style={{ overflow: "auto" }}>
              <FileDisplay file={this.state.aoe.authorizationImagePath} />
              {this.state.aoe.authorizationImagePath !== undefined ? (
                <a
                  href={this.state.aoe.authorizationImagePath}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View file in new Tab.
                </a>
              ) : (
                ""
              )}
            </Col>
            <Col md={6}>
              <b>
                {this.state.aoe.authorizationImagePath === undefined
                  ? "No Added Yet"
                  : ""}
              </b>
              <br />
              Authorization Date:{" "}
              {moment(this.state.aoe.authorizationDate).format("DD/MM/YYYY")}
              <br />
              Expiry Date:{" "}
              {moment(this.state.aoe.expirationDate).format("DD/MM/YYYY")}
              <br />
              Issuing Authority: {this.state.aoe.issuingAuthority}
              <br />
              <Button varient="success" onClick={this.handleModelShow}>
                Update Data
              </Button>
            </Col>
          </Row>
        </Grid>
        <Modal
          show={this.state.showModalUpdate}
          onHide={this.handleModelShow}
          backdrop="static"
          keyboard={false}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="content">
              <Grid fluid>
                <Row>
                  <Col md={12}>
                    <form>
                      <div className="clearfix" />
                      <div className="container-flex">
                        <div>
                          <div className="row">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Obtain Date</ControlLabel>
                                <FormControl
                                  className="form-control"
                                  type="date"
                                  value={moment(
                                    this.state.authorizationDate
                                  ).format("YYYY-MM-DD")}
                                  onChange={(e) => {
                                    this.setState({
                                      authorizationDate: e.target.value,
                                    });
                                  }}
                                />
                              </FormGroup>
                            </div>
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Expire Date</ControlLabel>
                                <FormControl
                                  className="form-control"
                                  type="date"
                                  value={moment(
                                    this.state.expirationDate
                                  ).format("YYYY-MM-DD")}
                                  onChange={(e) => {
                                    this.setState({
                                      expirationDate: e.target.value,
                                    });
                                  }}
                                />
                              </FormGroup>
                            </div>
                          </div>
                          <Row style={{ padding: "20px 0px" }}>
                            <Col md={6}>
                              <FormGroup>
                                <ControlLabel>Issuing Authority</ControlLabel>
                                <FormControl
                                  className="form-control"
                                  value={this.state.issuingAuthority}
                                  onChange={(e) => {
                                    this.setState({
                                      issuingAuthority: e.target.value,
                                    });
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <ControlLabel>
                                Upload Authorization File
                                <span className="text-red">*</span>
                              </ControlLabel>
                              <FormControl
                                type="file"
                                bsClass="form-control"
                                onChange={this.handleFrontFileSelect}
                                accept="image/jpeg,application/pdf"
                                name="authorizationImagePath"
                                id="authorizationImagePath"
                              />
                              {this.state.authorizationImagePath !== "" ? (
                                <a
                                  href={this.state.authorizationImagePath}
                                  target="_blank"
                                >
                                  View current File
                                </a>
                              ) : (
                                ""
                              )}
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </form>
                  </Col>
                </Row>
              </Grid>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModelShow}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSave}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AOE;
