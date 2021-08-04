import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
} from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import moment from "moment";
import { Translation } from "react-i18next";

class RCPro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rc: {},
      insurer: "",
      policeNumber: "",
      endDate: "",
      insuranceImagePath: "",
    };
  }
  WebServicesManager = new WebServicesManager();
  componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "InsuranceCompany/GetInsuranceCompanyByIdAsync",
        dataToFetch: this.props.insuranceCompanyInfoId,
        token: tokn,
      },
      (statusCode, response) => {
        if (response !== null) {
          this.setState({
            rc: response,
            insurer: response.insurer,
            policeNumber: response.policeNumber,
            endDate: response.endDate,
            insuranceImagePath: response.insuranceImagePath,
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
      this.setState({ insuranceImagePath: e.target.files[0].name });
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
            insuranceImagePath: response,
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
    const perobj = {
      id: this.props.insuranceCompanyInfoId,
      Insurer: this.state.insurer,
      PoliceNumber: this.state.policeNumber,
      EndDate: this.state.endDate,
      InsuranceImagePath: this.state.insuranceImagePath,
      Folder: `${this.props.id}`,
      // Folder:`${this.props.id}_${this.props.firstName}_${this.props.surName}`,
    };
    if (this.props.insuranceCompanyInfoId === "") {
      this.WebServicesManager.postApiCall(
        {
          endPoint: "InsuranceCompany",
          dataToInsert: JSON.stringify(perobj),
          token: tokn,
        },
        (statusCode, Resp) => {
          this.WebServicesManager.getApiWithParamCall(
            {
              endPoint: "Profile/GetProfileByPersonalId",
              dataToFetch: this.props.personalInfoId,
              token: tokn,
            },
            (statusCode, response) => {
              const infopr = {
                id: response.id,
                role: response.role,
                PersonalInfoId: response.personalInfoId,
                DrivingLisenceInfoId: response.drivingLisenceInfoId,
                ExersiceAuthorizationInfoId:
                  response.exersiceAuthorizationInfoId,
                VehicleDetailInfoId: response.vehicleDetailInfoId,
                VehicleInsuranceInfoId: response.vehicleInsuranceInfoId,
                DrivingSchoolInsuranceInfoId:
                  response.drivingSchoolInsuranceInfoId,
                TechnicalControlInfoId: response.technicalControlInfoId,
                BusinessInfoId: response.businessInfoId,
                InsuranceCompanyInfoId: Resp.id,
                DrivingSchoolIdentityInfoId:
                  response.drivingSchoolIdentityInfoId,
                DrivingSchoolApprovalInfoId:
                  response.drivingSchoolApprovalInfoId,
                DrivingSchoolManagerInfoId: response.drivingSchoolManagerInfoId,
                DrivingSchoolVehiclesInfoId:
                  response.drivingSchoolVehiclesInfoId,
                DrivingSchoolInstructorInfoId:
                  response.drivingSchoolInstructorInfoId,
                Lat: response.lat,
                Long: response.long,
                Status: response.status,
                BanStatus: response.banStatus,
                BanDate: response.banDate,
              };
              const dataToUpdate = JSON.stringify(infopr);
              this.WebServicesManager.postApiCall(
                {
                  endPoint: "Profile/UpdateProfile",
                  dataToInsert: dataToUpdate,
                  token: tokn,
                },
                (statusCode, response) => {
                  window.location.reload();
                }
              );
            }
          );
        }
      );
    } else {
      this.WebServicesManager.postApiCall(
        {
          endPoint: "InsuranceCompany/UpdateInsurance",
          dataToInsert: JSON.stringify(perobj),
          token: tokn,
        },
        (statusCode, Resp) => {
          // console.log("Resp", Resp);
          window.location.reload();
        }
      );
    }
  };

  render() {
    if (this.state.rc !== null)
      return (
        <>
          <Grid fluid>
            <Row>
              <Col md={6} style={{ overflow: "auto" }}>
                <FileDisplay
                  file={
                    this.state.rc.insuranceImagePath !== undefined
                      ? this.state.rc.insuranceImagePath
                      : ""
                  }
                />
                {this.state.rc.insuranceImagePath !== undefined ? (
                  <a
                    href={this.state.rc.insuranceImagePath}
                    rel="noopener noreferrer"
                    target="noopener noreferrer"
                  >
                    Ouvrir le fichier dans un nouvel onglet.
                  </a>
                ) : (
                  ""
                )}
              </Col>

              <Col md={6}>
                <b>
                  {this.state.rc === undefined &&
                  this.state.rc === {} &&
                  this.state.rc === null
                    ? "Pas encore ajouté"
                    : ""}
                </b>
                <br />
                Assureur: {this.state.rc.insurer}
                <br />
                N° de Police {this.state.rc.policeNumber}
                <br />
                Date d'expiration:{" "}
                {moment(this.state.rc.endDate).format("DD/MM/YYYY")}
                <br />
                <Button varient="success" onClick={this.handleModelShow}>
                  <Translation>{(t) => t("Update Data")}</Translation>
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
              <Modal.Title>
                <Translation>{(t) => t("Update Data")}</Translation>
              </Modal.Title>
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
                                  <ControlLabel>
                                  Date d'expiration
                                  </ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    type="date"
                                    value={moment(this.state.endDate).format(
                                      "YYYY-MM-DD"
                                    )}
                                    onChange={(e) => {
                                      this.setState({
                                        endDate: e.target.value,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </div>
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>N° de Police</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    type="text"
                                    value={this.state.policeNumber}
                                    onChange={(e) => {
                                      this.setState({
                                        policeNumber: e.target.value,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </div>
                            </div>
                            <Row style={{ padding: "20px 0px" }}>
                              <Col md={6}>
                                <FormGroup>
                                  <ControlLabel>Assureur</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    value={this.state.insurer}
                                    onChange={(e) => {
                                      this.setState({
                                        insurer: e.target.value,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <ControlLabel>
                                  Upload Insurance Certificate File
                                  <span className="text-red">*</span>
                                </ControlLabel>
                                <FormControl
                                  type="file"
                                  bsClass="form-control"
                                  onChange={this.handleFrontFileSelect}
                                  accept="image/x-png,image/gif,image/jpeg,application/pdf"
                                  name="insuranceImagePath"
                                  id="insuranceImagePath"
                                />
                                {this.state.insuranceImagePath !== "" ? (
                                  <a
                                    href={this.state.insuranceImagePath}
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
    else
      return (
        <Grid fluid>
          <Row>
            <Col md={12}>N/A</Col>
          </Row>
        </Grid>
      );
  }
}

export default RCPro;
