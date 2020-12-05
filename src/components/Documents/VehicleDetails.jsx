import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Button,
  Modal,
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Translation, withTranslation } from "react-i18next";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import moment from "moment";
import Utilities from "../../Utilities/Utilities";

class VehicleRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vIns: {},
      brand: "",
      model: "",
      gearBox: "",
      energy: "",
      dateOfFirstRegistration: "",
      color: "",
      greenCardImagePath: "",
      vehicleInsurer: "",
      vehiclePoliceNumber: "",
      vehicleInsuranceStartDate: "",
      vehicleInsuranceEndDate: "",
      startDateOfTech: "",
      endDateOfTechControl: "",
      technicalControlImagePath: "",
      vehicleRegistrationCertificatePhotoImagePath: "",
      vehicleePhotosImagePath: "",
      VImagePath: "",
      vRegCert: "",
      showModalUpdate: false,
      isUpdateDisable: true,
      brandList: [],
      modelList: [],
    };
  }
  WebServicesManager = new WebServicesManager();
  async componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    const { vehicleInfo, Type } = this.props;
    var vehicleInfoGet = vehicleInfo[`Vehicle${Type.split("veh")[1]}`];
    console.log("sad", vehicleInfo[`Vehicle${Type.split("veh")[1]}`]);
    var technicalData = JSON.parse(vehicleInfoGet.technicalControlInfoID);
    var insuranceData = JSON.parse(vehicleInfoGet.vehichleInsuranceInfoId);
    debugger;
    // if (Type === "veh1") {
    this.setState({
      vIns: vehicleInfoGet,
      brand: vehicleInfoGet.brand,
      model: vehicleInfoGet.model,
      color: vehicleInfoGet.color,
      gearBox: vehicleInfoGet.gearBox,
      energy: vehicleInfoGet.energy,
      dateOfFirstRegistration: vehicleInfoGet.dateOfFirstRegistration,
      vehicleRegistrationCertificatePhotoImagePath:
        vehicleInfoGet.vehicleRegistrationCertificatePhotoImagePath,
      VImagePath: vehicleInfoGet.vehicleePhotosImagePath,
      vRegCert: vehicleInfoGet.vehicleRegistrationCertificatePhotoImagePath,
      vehicleePhotosImagePath: vehicleInfoGet.vehicleePhotosImagePath,
      greenCardImagePath: insuranceData.greenCardImagePath,
      vehicleInsurer: insuranceData.insurer,
      vehiclePoliceNumber: insuranceData.policeNumber,
      vehicleInsuranceStartDate: insuranceData.startDate,
      vehicleInsuranceEndDate: insuranceData.endDate,
      startDateOfTech: technicalData.startDateOfTech,
      endDateOfTechControl: technicalData.endDateOfTechControl,
      technicalControlImagePath: technicalData.technicalControlImagePath,
    });
  }

  render() {
    const { role } = this.props;
    if (this.state.vIns !== null)
      return (
        <>
          <Grid fluid>
            <Row>
              <Col md={6}>
                <FileDisplay
                  file={
                    this.state.vehicleePhotosImagePath !== undefined
                      ? this.state.vehicleePhotosImagePath
                      : ""
                  }
                />
                <a
                  rel="noopener noreferrer"
                  href={
                    this.state.vehicleePhotosImagePath !== undefined
                      ? this.state.vehicleePhotosImagePath
                      : ""
                  }
                  target="_blank"
                >
                  View Vehicle file.
                </a>
                <hr />
                <FileDisplay
                  file={
                    this.state.vehicleRegistrationCertificatePhotoImagePath !==
                      undefined &&
                    this.state.vehicleRegistrationCertificatePhotoImagePath !==
                      null
                      ? this.state.vehicleRegistrationCertificatePhotoImagePath
                      : ""
                  }
                />
                <a
                  rel="noopener noreferrer"
                  href={
                    this.state.vehicleRegistrationCertificatePhotoImagePath !==
                    undefined
                      ? this.state.vehicleRegistrationCertificatePhotoImagePath
                      : ""
                  }
                  target="_blank"
                >
                  View Registration file.
                </a>
                <hr />
                <FileDisplay
                  file={
                    this.state.technicalControlImagePath !== undefined
                      ? this.state.technicalControlImagePath
                      : ""
                  }
                />
                <a
                  rel="noopener noreferrer"
                  href={
                    this.state.technicalControlImagePath !== undefined
                      ? this.state.technicalControlImagePath
                      : ""
                  }
                  target="_blank"
                  alt="techinal control"
                >
                  View file in new Tab.
                </a>
                <hr />
                {role !== "Instructor" ? (
                  <>
                    <FileDisplay
                      file={
                        this.state.greenCardImagePath !== undefined
                          ? this.state.greenCardImagePath
                          : ""
                      }
                    />
                    <a
                      rel="noopener noreferrer"
                      href={
                        this.state.greenCardImagePath !== undefined
                          ? this.state.greenCardImagePath
                          : ""
                      }
                      target="_blank"
                      alt="insurance Image"
                    >
                      View GreenCard file.
                    </a>
                  </>
                ) : (
                  ""
                )}
              </Col>

              <Col md={6}>
                <b>Vehicle Details</b>
                <br />
                Date Of First Registration:{" "}
                {moment(this.state.dateOfFirstRegistration).format(
                  "DD/MM/YYYY"
                )}
                <br />
                Brand: {this.state.brand}
                <br />
                Color: {this.state.color}
                <br />
                Model: {this.state.model}
                <br />
                GearBox: {this.state.gearBox}
                <br />
                Energy: {this.state.energy}
                <hr />
                <b>Vehicle Insurance</b>
                <br />
                Insurer: {this.state.vehicleInsurer}
                <br />
                Police Number: {this.state.vehiclePoliceNumber}
                <br />
                Start Data:{" "}
                {moment(this.state.vehicleInsuranceStartDate).format(
                  "DD/MM/YYYY"
                )}
                <br />
                End Data:{" "}
                {moment(this.state.vehicleInsuranceEndDate).format(
                  "DD/MM/YYYY"
                )}
                <hr />
                <b>Technical Control</b>
                <br />
                Start Data:{" "}
                {moment(this.state.startDateOfTech).format("DD/MM/YYYY")}
                <br />
                End Data:{" "}
                {moment(this.state.endDateOfTech).format("DD/MM/YYYY")}
                <hr />
                <Button varient="success" onClick={this.handleModelShow}>
                  Update Data
                </Button>
              </Col>
            </Row>
          </Grid>
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

export default VehicleRegistration;
