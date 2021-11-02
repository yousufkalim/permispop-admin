import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";
import { Button, message } from "antd";
import { Translation } from "react-i18next";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
// import { Card } from "components/Card/Card.jsx";
// import Button from "components/CustomButton/CustomButton.jsx";

const success = () => {
  message.config({
    maxCount: 1,
  });
  message.success({
    content: "Membership Added Successfully!",
  });
};

class AddUpdatePackage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pkName: "",
      pkDuration: "1day",
      pkRole: "admin",
      pkPrice: "",
      // pkDesc1: "",
      // pkDesc2: "",
      // pkDesc3: "",
      loading: false,
      disabled: true,
    };
  }

  WebServicesManager = new WebServicesManager();

  handleDisabled = () => {
    if (this.state.pkName === "" || this.state.pkPrice === "") return true;
    else return false;
  };
  handleSave = (e) => {
    this.setState({
      loading: true,
    });
    var tokn = localStorage.getItem("userdata");
    const pkg = {
      name: this.state.pkName,
      duration: this.state.pkDuration,
      price: this.state.pkPrice,
      createdBy: this.state.pkRole,
      // desc1: this.state.pkDesc1,
      // desc2: this.state.pkDesc2,
      // desc3: this.state.pkDesc3,
    };
    console.log("package post ", pkg);
    this.WebServicesManager.postApiCall(
      {
        endPoint: "Package",
        dataToInsert: JSON.stringify(pkg),
        token: tokn,
      },
      () => {
        Array.from(document.querySelectorAll("input")).forEach(
          (input) => (input.value = "")
        );
        this.setState({
          pkName: "",
          pkDuration: "1day",
          pkRole: "admin",
          pkPrice: "",
          loading: false,
        });
        this.props.toggle();
        success();
        // window.location.reload();
      }
    );
  };

  render() {
    return (
      <Translation>
        {(t) => (
          <div className="content">
            <Grid fluid>
              <Row>
                <Col md={12}>
                  <form>
                    <div className="clearfix" />
                    <div className="container-flex">
                      <div>
                        <div className="row">
                          <div className="col-md-12">
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  color: "rgb(51, 51, 51)",
                                }}
                              >
                                {t("Name")}
                              </ControlLabel>
                              <FormControl
                                className="form-control"
                                placeholder={t("Package Name")}
                                onChange={(e) => {
                                  this.setState({ pkName: e.target.value });
                                }}
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-12">
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  color: "rgb(51, 51, 51)",
                                }}
                              >
                                {t("Duration")}
                              </ControlLabel>

                              <select
                                className="form-control"
                                onChange={(e) => {
                                  this.setState({ pkDuration: e.target.value });
                                }}
                              >
                                <option value="1day">1 {t("Days")}</option>
                                <option value="3day">3 {t("Days")}</option>
                                <option value="7day">7 {t("Days")}</option>
                                <option value="7day">15 {t("Days")}</option>
                                <option value="7day">1 {t("Month")}</option>
                              </select>
                            </FormGroup>
                          </div>
                        </div>

                        <div className="row">
                          {/* <div className="col-md-6">
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  color: "rgb(51, 51, 51)",
                                }}
                              >
                                {t("For")}
                              </ControlLabel>
                              <select
                                className="form-control"
                                onChange={(e) => {
                                  this.setState({ pkRole: e.target.value });
                                }}
                              >
                                <option>{t("Student")}</option>{" "}
                                <option>{t("Instructor")}</option>{" "}
                                <option>{t("Driving School")}</option>
                              </select>
                            </FormGroup>
                          </div> */}
                          <div className="col-md-12">
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  color: "rgb(51, 51, 51)",
                                }}
                              >
                                {t("Price")}
                              </ControlLabel>
                              <FormControl
                                className="form-control"
                                placeholder={t("Package Price")}
                                onChange={(e) => {
                                  this.setState({ pkPrice: e.target.value });
                                }}
                              />
                            </FormGroup>
                          </div>
                        </div>

                        {/* <div className="row">
                          <div className="col-md-12">
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  color: "rgb(51, 51, 51)",
                                }}
                              >
                                {t("Description")} 1
                              </ControlLabel>
                              <FormControl
                                className="form-control"
                                text={this.state.pkName}
                                placeholder={t("Package Description") + " 1"}
                                onChange={(e) => {
                                  this.setState({ pkDesc1: e.target.value });
                                }}
                              />
                            </FormGroup>
                          </div>
                        </div> */}

                        {/* <div className="row">
                          <div className="col-md-12">
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  color: "rgb(51, 51, 51)",
                                }}
                              >
                                {t("Description")} 2
                              </ControlLabel>
                              <FormControl
                                className="form-control"
                                text={this.state.pkName}
                                placeholder={t("Package Description") + " 2"}
                                onChange={(e) => {
                                  this.setState({ pkDesc2: e.target.value });
                                }}
                              />
                            </FormGroup>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12">
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  color: "rgb(51, 51, 51)",
                                }}
                              >
                                {t("Description")} 3
                              </ControlLabel>
                              <FormControl
                                className="form-control"
                                text={this.state.pkName}
                                placeholder={t("Package Description") + " 3"}
                                onChange={(e) => {
                                  this.setState({ pkDesc3: e.target.value });
                                }}
                              />
                            </FormGroup>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <Button
                      className="add-package-button"
                      onClick={this.handleSave}
                      loading={this.state.loading}
                      disabled={this.handleDisabled()}
                    >
                      {t("Save")}
                    </Button>
                    <div className="clearfix" />
                  </form>
                </Col>
              </Row>
            </Grid>
          </div>
        )}
      </Translation>
    );
  }
}

export default AddUpdatePackage;
