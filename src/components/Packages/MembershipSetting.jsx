import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Translation } from "react-i18next";

import WebServicesManager from "../../WebServicesManager/WebServicesManager";
// import { Modal } from "antd";

class MembershipSetting extends Component {
  constructor(props) {
    super(props);
    this.state = { packages: [] };
  }

  WebServicesManager = new WebServicesManager();

  componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "package/GetStudentPackages",
        token: tokn,
      },
      (statusCode, pgkDetails) => {
        this.setState({ packages: pgkDetails });
        // console.log(pgkDetails);
      }
    );
  }
  render() {
    return (
      <Translation>
        {(t) => (
          <div className="content">
            <Grid fluid>
              <Row>
                <Col md={12}>
                  <Grid fluid>
                    <Row
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        marginBottom: "20px",
                        paddingBottom: "20px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Col md={6}>
                        {" "}
                        <div
                          style={{
                            marginLeft: "60px",
                            fontSize: "16px",
                            fontWeight: "400",
                            color: "rgb(51, 51, 51)",
                          }}
                        >
                          {t("Role")}
                        </div>
                      </Col>

                      <Col md={6}>
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            fontSize: "16px",
                            fontWeight: "400",
                            color: "rgb(51, 51, 51)",
                          }}
                        >
                          {t("Membership Type")}
                        </div>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Col md={6}>{t("Student Membership")}</Col>
                      <Col
                        md={6}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>{t("Free")}</div>
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round"></span>
                        </label>{" "}
                        <div>{t("Paid")}</div>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Col md={6}>{t("Instructor Membership")}</Col>
                      <Col
                        md={6}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>{t("Free")}</div>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>{" "}
                        <div>{t("Paid")}</div>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Col md={6}>{t("Driving Membership")}</Col>
                      <Col
                        md={6}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>{t("Free")}</div>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>{" "}
                        <div>{t("Paid")}</div>
                      </Col>
                    </Row>
                  </Grid>
                </Col>
              </Row>
            </Grid>
          </div>
        )}
      </Translation>
    );
  }
}

export default MembershipSetting;
