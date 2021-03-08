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
class Siret extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siret: {},
      showModelUpdate: false,
      siratImagePath: "",
      siretNumber: "",
    };
  }
  WebServicesManager = new WebServicesManager();
  componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    // if (this.props.role === "DSInstructor") {
    //   const response = JSON.parse(this.props.businessInfoId);
    //   this.setState({
    //     siret: response,
    //     siratImagePath: response.siratImagePath,
    //     siretNumber: response.siretNumber,
    //   });
    // }
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Business/GetBusinessStoreByUserId",
        dataToFetch: this.props.businessInfoId,
        token: tokn,
      },
      (statusCode, response) => {
        if (response !== null) {
          this.setState({
            siret: response,
            siratImagePath: response.siratImagePath,
            siretNumber: response.siretNumber,
          });
        }
      }
    );
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
      this.setState({ siratImagePath: e.target.files[0].name });
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
            siratImagePath: response,
          });
        }
      );
    } else {
      console.log("file is null");
    }
  };

  handleSave = () => {
    var tokn = localStorage.getItem("userdata");
    // console.log("save");
    // save login will go here
    // if (this.props.role === "DSInstructor") {
    //   const perobj = {
    //     id: this.props.businessInfoId,
    //     siratImagePath: this.state.siratImagePath,
    //     siretNumber: this.state.siretNumber,
    //     folder: `${this.props.id}`,
    //     // folder: `${this.props.id}_${this.props.firstName}_${this.props.surName}`,
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
    //         ExersiceAuthorizationInfoId: response.exersiceAuthorizationInfoId,
    //         VehicleDetailInfoId: response.VehicleDetailInfoId,
    //         VehicleInsuranceInfoId: response.vehicleInsuranceInfoId,
    //         DrivingSchoolInsuranceInfoId: response.drivingSchoolInsuranceInfoId,
    //         TechnicalControlInfoId: response.technicalControlInfoId,
    //         BusinessInfoId: JSON.stringify(perobj),
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
      id: this.props.businessInfoId,
      SiratImagePath: this.state.siratImagePath,
      SiretNumber: this.state.siretNumber,
      Folder: `${this.props.id}`,
      // Folder: `${this.props.id}_${this.props.firstName}_${this.props.surName}`,
    };
    this.WebServicesManager.postApiCall(
      {
        endPoint: "Business/UpdateBusinessTable",
        dataToInsert: JSON.stringify(perobj),
        token: tokn,
      },
      (statusCode, Resp) => {
        // console.log("Resp", Resp);
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
            <Col md={6}>
              <FileDisplay
                file={
                  this.state.siret.siratImagePath !== undefined ||
                  this.state.siret.siratImagePath !== null
                    ? this.state.siret.siratImagePath
                    : ""
                }
              />
              {this.state.siret.siratImagePath !== undefined ? (
                <a
                  rel="noopener noreferrer"
                  href={this.state.siret.siratImagePath}
                  target="noopener noreferrer"
                >
                  View file in new Tab.
                </a>
              ) : (
                ""
              )}
            </Col>
            <Col md={6}>
              <b>
                {this.state.siret.siratImagePath === undefined
                  ? "No Added Yet"
                  : ""}
              </b>
              <br />
              Siret Number: {this.state.siret.siretNumber}
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
                          <Row style={{ padding: "20px 0px" }}>
                            <Col md={6}>
                              <FormGroup>
                                <ControlLabel>Sirat Number</ControlLabel>
                                <FormControl
                                  className="form-control"
                                  maxLength={14}
                                  value={this.state.siretNumber}
                                  onChange={(e) => {
                                    this.setState({
                                      siretNumber: e.target.value,
                                    });
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <ControlLabel>
                                Upload Sirat File
                                <span className="text-red">*</span>
                              </ControlLabel>
                              <FormControl
                                type="file"
                                bsClass="form-control"
                                onChange={this.handleFrontFileSelect}
                                accept="image/x-png,image/gif,image/jpeg,application/pdf"
                                name="frontIDPhoto"
                                id="frontIDPhoto"
                                value=""
                              />
                              {this.state.siratImagePath !== "" ? (
                                <a
                                  href={this.state.siratImagePath}
                                  target="noopener noreferrer"
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

export default Siret;
