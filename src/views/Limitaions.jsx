import React, { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import DataTableCustom from "components/DataTables/datatables";

function Limitaions() {
  const [userLimits, setUserLimits] = useState({});
  const [updateLimit, setUpdateLimit] = useState();
  const [customValue, setCustomValue] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetch("http://localhost:5000/api/dynamic/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userdata"),
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        var custom = [];
        setUserLimits(resJson);
        resJson.customValues.map((item) => {
          console.log(item);
          debugger;
          custom.push([
            `${item.user.FirstName} ${item.user.SurName}`,
            item.user.Role,
            item.user.Role !== "Student"
              ? `<ul>
                <li>Max Vehicle Add = ${
                  item.user.Role === "Instructor"
                    ? item.vehicleAddLimitInstructor !== undefined
                      ? item.vehicleAddLimitInstructor
                      : resJson.vehicleAddLimitInstructor
                    : item.vehicleAddLimitDrivingSchool !== undefined
                    ? item.vehicleAddLimitDrivingSchool
                    : resJson.vehicleAddLimitDrivingSchool
                }</li>
                <li>Max Booking Allowed = ${
                  item.maxBookingLimit !== undefined
                    ? item.maxBookingLimit
                    : resJson.maxBookingLimit
                }</li>
                ${
                  item.user.Role === "DrivingSchool"
                    ? `<li>${
                        item.instructorAddLimit !== undefined
                          ? item.instructorAddLimit
                          : resJson.instructorAddLimit
                      }</li>`
                    : ""
                }
              </ul>`
              : `Max Booking Allowed = 20`,
            item.user.id,
          ]);
        });
        setCustomValue(custom);
      })
      .catch((e) => console.log("error loading: ", e));
  };

  // action to apply on datatables

  return (
    <div className="content">
      <Grid fluid>
        <Row>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-plus text-success" />}
              statsText="Vehicle Add Limit Instructor"
              statsValue={userLimits.vehicleAddLimitInstructor}
            />
          </Col>

          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-plus text-primary" />}
              statsText="Vehicle Add Limit Driving School"
              statsValue={userLimits.vehicleAddLimitDrivingSchool}
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-plus text-warning" />}
              statsText="DrivingSchool Instructor Limit"
              statsValue={userLimits.instructorAddLimit}
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-note text-danger" />}
              statsText="Max Booking Allowed/Week"
              statsValue={userLimits.maxBookingLimit}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="info-row-table">
            <h3>Custom Limits for users</h3>
            <i className="fa fa-plus-circle"></i>
          </Col>
          <Col sm={12}>
            {customValue.length > 0 ? (
              <DataTableCustom
                columns={columns}
                data={customValue}
                actionCol={3}
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

export default Limitaions;

const columns = [
  { title: "Name" },
  { title: "Role" },
  { title: "Fields" },
  {
    title: "Action",
    value: "Action here",
  },
];
