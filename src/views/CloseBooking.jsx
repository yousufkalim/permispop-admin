import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  Button,
} from "react-bootstrap";
import { Translation } from "react-i18next";
import moment from "moment";

// Datepicker Language
import DatePicker, { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
import fr from "date-fns/locale/fr";

// Datepicker Language
registerLocale("en", en);
registerLocale("fr", fr);

// import { Card } from "components/Card/Card.jsx";

class CloseBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCounts: null,
      userListWithBookingCount: [],
      limitaion: null,
      // booking cancel states
      startDate: new Date(),
      endDate: new Date(),
      message: "",
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("userdata");

    // fetch data for booking counts limit
    fetch(`${process.env.REACT_APP_BASE_NODE}dynamic/getBookingCounts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        // console.log(resJson, "res");
        this.setState({ userListWithBookingCount: resJson });
      })
      .catch((e) => console.log(e));

    // get limitations
    fetch(`${process.env.REACT_APP_BASE_NODE}dynamic/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userdata"),
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ limitaions: resJson });
      })
      .catch((e) => console.log(e));
  }

  closeBookingRange = () => {
    const { startDate, endDate, message } = this.state;

    console.log("message submit ", message);

    const info = {
      message,
      startDate: startDate + "T00:00:00Z",
      endDate: endDate + "T23:59:00",
    };
    fetch(`${process.env.REACT_APP_BASE_NODE}dynamic/closerangebooking`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userdata"),
        "content-type": "application/json",
      },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((resJson) => {
        alert(resJson);
        document.getElementById("reasontoclose").value = "";
        this.setState({
          startDate: new Date(),
          endDate: new Date(),
          message: "",
        });
      })
      .catch((e) => console.log(e));
  };

  render() {
    const lang = localStorage.getItem("language");
    // Datepicker Language
    var selectedDateLang = fr;
    return (
      <Translation>
        {(t) => (
          <div className="content">
            <Grid fluid>
              <Row>
                <Translation>
                  {(t) => (
                    <Col md={12}>
                      <h3
                        style={{
                          fontSize: "22px",
                          fontWeight: "300",
                          color: "#333333",
                          marginTop: "-10px",
                          marginBottom: "10px",
                        }}
                      >
                        {t("Close Booking")}
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#9A9A9A",
                          marginBottom: "20px",
                        }}
                      >
                        {t("Close All booking in between two dates")}
                      </p>
                      <div className="ct-chart">
                        <Row>
                          <Col md={4}>
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  color: "rgb(100 99 99)",
                                }}
                              >
                                {t("Start Date")}{" "}
                                <span
                                  className="text-red"
                                  style={{ color: "red" }}
                                >
                                  *
                                </span>
                              </ControlLabel>
                              <DatePicker
                                selected={this.state.startDate}
                                locale={selectedDateLang}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) =>
                                  this.setState({
                                    startDate: date,
                                  })
                                }
                                className="form-control"
                                value={this.state.startDate}
                                autoComplete="off"
                                placeholderText="DD/MM/YYYY"
                                name="pickDate"
                                id="pickdate"
                              />
                              {/* <input
                                type="date"
                                className="form-control"
                                name="pickDate"
                                id="pickdate"
                                value={moment(this.state.startDate).format(
                                  "YYYY-MM-DD"
                                )}
                                max={moment().format("YYYY-MM-DD")}
                                onChange={(event) => {
                                  this.setState({
                                    startDate: event.target.value,
                                  });
                                }}
                              /> */}
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  color: "rgb(100 99 99)",
                                }}
                              >
                                {t("End Date")}{" "}
                                <span
                                  className="text-red"
                                  style={{ color: "red" }}
                                >
                                  *
                                </span>
                              </ControlLabel>
                              <DatePicker
                                selected={this.state.endDate}
                                locale={selectedDateLang}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) =>
                                  this.setState({
                                    endDate: date,
                                  })
                                }
                                className="form-control"
                                value={this.state.endDate}
                                autoComplete="off"
                                placeholderText="DD/MM/YYYY"
                                name="pickDate"
                                id="pickdate"
                              />
                              {/* <input
                                type="date"
                                className="form-control"
                                name="pickDate"
                                id="pickdate"
                                value={moment(this.state.endDate).format(
                                  "YYYY-MM-DD"
                                )}
                                min={moment().format("YYYY-MM-DD")}
                                onChange={(event) => {
                                  this.setState({
                                    endDate: event.target.value,
                                  });
                                }}
                              /> */}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <ControlLabel
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  color: "rgb(100 99 99)",
                                }}
                              >
                                {t("Message/Reason")}{" "}
                                <span
                                  className="text-red"
                                  style={{ color: "red" }}
                                >
                                  *
                                </span>
                                <textarea
                                  value={this.state.message}
                                  className="form-control"
                                  rows="5"
                                  style={{ width: 400, marginTop: "6px" }}
                                  onChange={(e) =>
                                    this.setState({ message: e.target.value })
                                  }
                                  id="reasontoclose"
                                />
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <Button
                              variant="danger"
                              disabled={this.state.message === ""}
                              onClick={this.closeBookingRange}
                            >
                              {t("Close Bookings")}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  )}
                </Translation>
                <Col md={4}></Col>
              </Row>
            </Grid>
          </div>
        )}
      </Translation>
    );
  }
}

export default CloseBooking;
