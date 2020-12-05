import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import {
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar,
} from "variables/Variables.jsx";

var legendPieLocal = {
  names: ["Male", "Female", "Others"],
  types: ["info", "danger", "warning"],
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCounts: null,
      genderData: null,
      userListWithBookingCount: [],
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
    fetch("http://localhost:5000/api/personal/getusercount", {
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
        var dataPieLocal = {
          labels: [
            `${(resJson.genderCount.male * 100) / countUser}%`,
            `${(resJson.genderCount.female * 100) / countUser}%`,
            `${(resJson.genderCount.others * 100) / countUser}%`,
          ],
          series: [
            resJson.genderCount.male,
            resJson.genderCount.female,
            resJson.genderCount.others,
          ],
        };
        this.setState({ userCounts: resJson, genderData: dataPieLocal }, () =>
          console.log("data", this.state)
        );
      })
      .catch((err) => console.log("error: ", err));

    // fetch data for booking counts limit
    fetch("http://localhost:5000/api/dynamic/getBookingCounts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson, "res");
        this.setState({ userListWithBookingCount: resJson });
      })
      .catch((e) => console.log(e));
  }
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
                  statsText="Students"
                  statsValue={userCounts.students}
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-users text-success" />}
                  statsText="Intructors"
                  statsValue={userCounts.instructors}
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-home text-danger" />}
                  statsText="Driving School"
                  statsValue={userCounts.drivingSchool}
                  statsIcon={<i className="fa fa-users" />}
                  statsIconText={`Instructor Attached: ${userCounts.dsInstructor}`}
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-car text-info" />}
                  statsText="Rental Car Company"
                  statsValue={userCounts.carRantal}
                />
              </Col>
            </Row>
          ) : (
            ""
          )}
          <Row>
            <Col md={12}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Users Behavior"
                category="24 Hours performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}></Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="User Booking Counts"
                title="Booking Count"
                category="Users with max booking count"
                stats="current week"
                statsIcon="fa fa-calendar"
                content={
                  <div className="user-booking-count-div">
                    <ListGroup varient="flush">
                      {this.state.userListWithBookingCount.map((item) => (
                        <ListGroupItem
                          key={item.user_id}
                          className="custome_list_item"
                        >
                          <span>{item.user}</span>
                          <span className="number">{item.bookingCount}</span>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                statsIcon="fa fa-clock-o"
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
