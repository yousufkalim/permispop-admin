import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import CountUp from "react-countup";
import {
  Grid,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  // Checkbox,
  // FormGroup,
  // Button,
  // FormControl,
  // ControlLabel,
  // HelpBlock,
} from "react-bootstrap";
// import { Translation } from "react-i18next";
import moment from "moment";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import Switch from "react-switch";

var legendPieLocal = {
  names: ["Male", "Female", "Others"],
  types: ["info", "danger", "warning"],
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCounts: null,
      genderData: {},
      userListWithBookingCount: [],
      limitaion: null,
      // booking cancel states
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      message: "",
    };
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  componentDidMount() {
    const token = localStorage.getItem("userdata");
    fetch(`${process.env.REACT_APP_BASE_NODE}personal/getusercount`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        var countUser =
          resJson.genderCount.male +
          resJson.genderCount.female +
          resJson.genderCount.others;
        console.log(resJson.genderCount.others);
        var dataPieLocal = {
          labels: [
            // `${((resJson.genderCount.male * 100) / countUser).toFixed(2)}%`,
            // `${((resJson.genderCount.female * 100) / countUser).toFixed(2)}%`,
            // `${((resJson.genderCount.others * 100) / countUser).toFixed(2)}%`,
          ],
          series: [
            // resJson.genderCount.male, resJson.genderCount.female
          ],
        };
        if (resJson.genderCount.male > 0) {
          dataPieLocal.labels.push(
            `${((resJson.genderCount.male * 100) / countUser).toFixed(2)}%`
          );
          dataPieLocal.series.push(resJson.genderCount.male);
        }
        if (resJson.genderCount.female > 0) {
          dataPieLocal.labels.push(
            `${((resJson.genderCount.female * 100) / countUser).toFixed(2)}%`
          );
          dataPieLocal.series.push(resJson.genderCount.female);
        }
        if (resJson.genderCount.others > 0) {
          dataPieLocal.labels.push(
            `${((resJson.genderCount.others * 100) / countUser).toFixed(2)}%`
          );
          dataPieLocal.series.push(resJson.genderCount.others);
        }
        this.setState(
          { userCounts: resJson, genderData: dataPieLocal }
          //  ,() => console.log("data", this.state)
        );
      })
      .catch((err) => console.log("error: ", err));

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

  // change mailing status

  changeMailingStatus = (status) => {
    this.setState(
      { limitaions: { ...this.state.limitaions, mailReports: status } },
      () => {
        // api call to update status in backend
        fetch(
          `${process.env.REACT_APP_BASE_NODE}dynamic/updateMailStatus/${status}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("userdata"),
              "content-type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((resJson) => console.log(resJson))
          .catch((e) => console.log(e));
      }
    );
  };

  closeBookingRange = () => {
    const { startDate, endDate, message } = this.state;

    const info = {
      message,
      startDate: startDate + "T00:00:00Z",
      endDate: endDate + "T23:59:00",
    };
    fetch(`${process.env.REACT_APP_BASE_NODE}/dynamic/closerangebooking`, {
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
          startDate: moment().format("YYYY-MM-DD"),
          endDate: moment().format("YYYY-MM-DD"),
          message: "",
        });
      })
      .catch((e) => console.log(e));
  };

  render() {
    const { userCounts } = this.state;
    return (
      <div className="content">
        <Grid fluid>
          {userCounts !== null ? (
            <Row>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-study text-warning" />}
                  statsValue={
                    <CountUp end={100} />
                    // userCounts.students
                  }
                  statsText="Students"
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-users text-success" />}
                  statsValue={
                    <CountUp end={100} />
                    // userCounts.instructors
                  }
                  statsText="Intructors"
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-home text-danger" />}
                  statsValue={
                    <CountUp end={100} />
                    // userCounts.drivingSchool
                  }
                  statsText="Driving School"
                  statsIcon={<i className="fa fa-users" />}
                  statsIconText={`Instructor Attached: ${userCounts.dsInstructor}`}
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-car text-info" />}
                  statsValue={
                    <CountUp end={100} />
                    // userCounts.carRantal
                  }
                  statsText="Rental Car Company"
                />
              </Col>
            </Row>
          ) : (
            ""
          )}
          {/* <Row>
            <Translation>
              {(t) => (
                <Col md={12}>
                  <Card
                    id="chartHours"
                    title="Close Booking"
                    category="Close All booking in between two dates"
                    content={
                      <div className="ct-chart">
                        <Row>
                          <Col md={4}>
                            <FormGroup>
                              <ControlLabel>
                                {t("Start Date")}{" "}
                                <span className="text-red">*</span>
                              </ControlLabel>
                              <input
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
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <ControlLabel>
                                {t("End Date")}{" "}
                                <span className="text-red">*</span>
                              </ControlLabel>
                              <input
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
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <ControlLabel>
                                {t("Message/Reason")}{" "}
                                <span className="text-red">*</span>
                                <textarea
                                  value=""
                                  className="form-control"
                                  rows="5"
                                  style={{ width: 400 }}
                                  onChange={(e) =>
                                    this.setState({ message: e.target.value })
                                  }
                                  id="reasontoclose"
                                >
                                  {this.state.message}
                                </textarea>
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
                              Close Bookings
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    }
                  />
                </Col>
              )}
            </Translation>
            <Col md={4}></Col>
          </Row> */}

          <Row>
            <Col md={6}>
              <Card
                id="User Booking Counts"
                title="Booking Count"
                category="Users with max booking count"
                stats="current week"
                statsIcon="fa fa-calendar"
                content={
                  <>
                    <Switch
                      onChange={(checked) => this.changeMailingStatus(checked)}
                      checked={
                        this.state.limitaions !== undefined
                          ? this.state.limitaions.mailReports
                          : true
                      }
                      name="withOther"
                      offColor="#888"
                      onColor="#149e7a"
                    />
                    <br />
                    <small className="text-muted">Send Reports via mail</small>
                    <div className="user-booking-count-div">
                      <ListGroup varient="flush">
                        {this.state.userListWithBookingCount.map((item) =>
                          item.bookingCount !== 0 ? (
                            <ListGroupItem
                              key={item.user_id}
                              className="custome_list_item"
                            >
                              <span>{item.user}</span>
                              <span className="number">
                                {item.bookingCount}
                              </span>
                            </ListGroupItem>
                          ) : (
                            ""
                          )
                        )}
                      </ListGroup>
                    </div>
                  </>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Gender Count"
                category="Number of user by gender register to platform"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={this.state.genderData} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">
                    {this.createLegend(legendPieLocal)}
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

export default Dashboard;
