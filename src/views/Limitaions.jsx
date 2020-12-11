import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Row,
  Col,
  Modal,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import DataTableCustom from "components/DataTables/datatables";
import WebServicesManager from "WebServicesManager/WebServicesManager";

function Limitaions() {
  const WebServicesManagers = useMemo(() => new WebServicesManager());
  const [userLimits, setUserLimits] = useState({});
  const [updateLimit, setUpdateLimit] = useState();
  const [customValue, setCustomValue] = useState([]);
  const [show, setShow] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [customLimitValue, setCustomLimitValue] = useState(0);
  const [newCustom, setNewCustom] = useState({});
  const [listAppend, setListAppend] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    loadData();
    loadUserData();
  }, [updateLimit]);

  const loadData = () => {
    setCustomValue([]);
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
                    ? `<li>Max Instructor Add = ${
                        item.instructorAddLimit !== undefined
                          ? item.instructorAddLimit
                          : resJson.instructorAddLimit
                      }</li>`
                    : ""
                }
              </ul>`
              : `Max Booking Allowed = 20`,
            item,
          ]);
        });
        setCustomValue(custom);
      })
      .catch((e) => console.log("error loading: ", e));
  };

  const loadUserData = () => {
    //  call api
    var tokn = localStorage.getItem("userdata");
    WebServicesManagers.getApiCall(
      {
        endPoint: "Personal/GetAllUsers",
        token: tokn,
      },
      (statusCode, response) => {
        response = response.filter(
          (item) =>
            item.role !== "Admin" &&
            item.role !== "Email" &&
            item.role !== "Student"
        );
        setUserList(response);
      }
    );
  };

  // action to apply on datatables

  const handleShow = () => {
    setShow(!show);
  };

  const addNewRecord = (e) => {
    e.preventDefault();
    var newis = newCustom;
    if (fieldValue === "vehicleAddLimit") {
      var currentUser = userList.find((item) => item.id === newis.user);
      if (currentUser.role === "Instructor") {
        newis.vehicleAddLimitInstructor = customLimitValue;
      } else if (currentUser.role === "DrivingSchool") {
        newis.vehicleAddLimitDrivingSchool = customLimitValue;
      } else {
        newis[fieldValue] = customLimitValue;
      }
    } else {
      newis[fieldValue] = customLimitValue;
    }
    var customis = {
      key: fieldValue,
      value: customLimitValue,
    };
    var result = listAppend.find((item) => item.key === customis.key);
    if (result === undefined) {
      setListAppend([...listAppend, customis]);
      setNewCustom(newis);
    } else {
      if (result.value === customis.value) {
        window.alert("Value Already Exist");
      } else {
        var indexofval = listAppend.indexOf(result);
        var listis = listAppend;
        listis[indexofval].value = customis.value;
        setListAppend(listis);
        setNewCustom(newis);
        console.log(newCustom);
      }
    }
  };

  const AddRecordToDb = () => {
    var finduser = userLimits.customValues.find(
      (item) => item.user.id === newCustom.user
    );
    debugger;
    console.log(finduser);
    if (finduser === undefined) {
      // perform saving actions
      fetch("http://localhost:5000/api/dynamic/adduserlimits", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("userdata"),
          "content-type": "application/json",
        },
        body: JSON.stringify(newCustom),
      })
        .then((res) => res.json())
        .then((resJson) => {
          console.log(resJson);
          setCustomLimitValue("");
          setFieldValue("");
          setListAppend([]);
          setNewCustom({});
          setShow(false);
          loadData();
        });
    } else {
      // show error that user exist try updating it
      window.alert("User Already exists please update from there");
    }
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure want to delete?" + id);

    if (confirm === true) {
      fetch("http://localhost:5000/api/dynamic/removeuserlimits/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("userdata"),
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((resJson) => {
          console.log(resJson);
          loadData();
        })
        .catch((e) => console.log("delete error: ", e));
    }
  };
  const actions = {
    onDelete: handleDelete,
  };

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
            <i className="fa fa-plus-circle" onClick={handleShow}></i>
          </Col>
          <Col sm={12}>
            {customValue.length > 0 ? (
              <DataTableCustom
                columns={columns}
                data={customValue}
                actionCol={3}
                actions={actions}
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Grid>
      {/* give user special limitations */}
      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Add Special Limitations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <ControlLabel>User</ControlLabel>
              <FormControl
                componentClass="select"
                name="gender"
                value={newCustom.user ? newCustom.user : ""}
                onChange={(e) => {
                  setNewCustom({ ...newCustom, user: e.target.value });
                }}
              >
                <React.Fragment>
                  <option>Select User</option>
                  {userList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.firstName + " " + item.surName}
                    </option>
                  ))}
                </React.Fragment>
              </FormControl>
            </FormGroup>
            <Row>
              <Col sm={5}>
                <FormGroup>
                  <ControlLabel>Field</ControlLabel>
                  <FormControl
                    componentClass="select"
                    name="field to add"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                  >
                    <React.Fragment>
                      <option value="">Select Field</option>
                      <option value="instructorAddLimit">
                        Instructor Add Limit
                      </option>
                      <option value="vehicleAddLimit">Vehicle Add Limit</option>
                      <option value="maxBookingLimit">Booking Limit</option>
                    </React.Fragment>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col sm={5}>
                <FormGroup>
                  <ControlLabel>Value</ControlLabel>
                  <FormControl
                    type="number"
                    name="fieldvalue"
                    value={customLimitValue}
                    min={1}
                    onChange={(e) => setCustomLimitValue(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col sm={2}>
                <FormGroup>
                  <ControlLabel style={{ visibility: "hidden" }}>
                    i
                  </ControlLabel>
                  <FormControl
                    type="submit"
                    className="btn btn-success"
                    name="add"
                    value="Add"
                    disabled={fieldValue === "" || customLimitValue <= 0}
                    onClick={addNewRecord}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="customWrap">
              {listAppend.map((item, index) => (
                <li key={index}>{`${item.key} = ${item.value}`}</li>
              ))}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={AddRecordToDb}
            disabled={listAppend.length <= 0 || newCustom.user === undefined}
          >
            Add Record
          </Button>
        </Modal.Footer>
      </Modal>
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
