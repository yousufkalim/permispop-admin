import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Row,
  Col,
  Modal,
  // Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
// import DataTableCustom from "components/DataTables/datatables";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import { Button, Table, Popconfirm, Space, Input } from "antd";
import { motion } from "framer-motion";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

function Limitaions() {
  const WebServicesManagers = useMemo(() => new WebServicesManager(), []);
  const [userLimits, setUserLimits] = useState({});
  // const [updateLimit, setUpdateLimit] = useState();
  const [updateLimit] = useState();
  const [customValue, setCustomValue] = useState([]);
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [customLimitValue, setCustomLimitValue] = useState(0);
  const [newCustom, setNewCustom] = useState({});
  const [updateCustom, setUpdateCustom] = useState(null);
  const [listAppend, setListAppend] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchedColumn, setsearchedColumn] = useState([]);
  const [searchText, setsearchText] = useState([]);

  useEffect(() => {
    loadData();
    loadUserData();
    // eslint-disable-next-line
  }, [updateLimit]);

  const loadData = () => {
    setCustomValue([]);
    fetch(`${process.env.REACT_APP_BASE_NODE}dynamic/`, {
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
          custom.push([
            `${item.user.FirstName} ${item.user.SurName}`,
            item.user.Role,
            // item.user.Role !== "Student"
            //   ? `<ul>
            //     <li>Max Vehicle Add = ${
            //       item.user.Role === "Instructor"
            //         ? item.vehicleAddLimitInstructor !== undefined
            //           ? item.vehicleAddLimitInstructor
            //           : resJson.vehicleAddLimitInstructor
            //         : item.vehicleAddLimitDrivingSchool !== undefined
            //         ? item.vehicleAddLimitDrivingSchool
            //         : resJson.vehicleAddLimitDrivingSchool
            //     }</li>
            //     ${
            //       item.user.Role === "DrivingSchool"
            //         ? `<li>Max Instructor Add = ${
            //             item.instructorAddLimit !== undefined
            //               ? item.instructorAddLimit
            //               : resJson.instructorAddLimit
            //           }</li>`
            //         : ""
            //     }
            //   </ul>`
            //   : ``,
            item.user.Role !== "Student"
              ? [
                  `Max Vehicle Add = ${
                    item.user.Role === "Instructor"
                      ? item.vehicleAddLimitInstructor !== undefined
                        ? item.vehicleAddLimitInstructor
                        : resJson.vehicleAddLimitInstructor
                      : item.vehicleAddLimitDrivingSchool !== undefined
                      ? item.vehicleAddLimitDrivingSchool
                      : resJson.vehicleAddLimitDrivingSchool
                  }`,
                  item.user.Role === "DrivingSchool"
                    ? `\nMax Instructor Add = ${
                        item.instructorAddLimit !== undefined
                          ? item.instructorAddLimit
                          : resJson.instructorAddLimit
                      }`
                    : "",
                ]
              : ``,
            item,
          ]);
          return null;
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
  const handleUpdateShow = () => {
    setShowUpdate(!showUpdate);
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
        // console.log(newCustom);
      }
    }
  };

  const AddRecordToDb = () => {
    debugger;
    var finduser = userLimits.customValues.find(
      (item) => item.user.id === newCustom.user
    );
    // debugger;
    // console.log(finduser);
    if (finduser === undefined) {
      // perform saving actions
      fetch(`${process.env.REACT_APP_BASE_NODE}dynamic/adduserlimits`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("userdata"),
          "content-type": "application/json",
        },
        body: JSON.stringify(newCustom),
      })
        .then((res) => res.json())
        .then((resJson) => {
          // console.log(resJson);
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
  const updateRecordToDb = () => {
    // perform saving actions
    fetch(`${process.env.REACT_APP_BASE_NODE}dynamic/updateuserlimits`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userdata"),
        "content-type": "application/json",
      },
      body: JSON.stringify(updateCustom),
    })
      .then((res) => res.json())
      .then((resJson) => {
        // console.log(resJson);
        setCustomLimitValue("");
        setFieldValue("");
        setListAppend([]);
        setUpdateCustom(null);
        setShowUpdate(false);
        loadData();
      });
  };

  const handleDelete = (id) => {
    // const confirm = window.confirm(
    //   "Are you sure want to delete this Custom limit?"
    // );
    fetch(`${process.env.REACT_APP_BASE_NODE}dynamic/removeuserlimits/` + id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userdata"),
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        // console.log(resJson);
        loadData();
      })
      .catch((e) => console.log("delete error: ", e));
  };

  // useEffect(() => {
  //   if (updateCustom !== null && showUpdate === false) {
  //     setShowUpdate(true);
  //   }
  // }, [updateCustom]);

  const handleUpdateClick = (data) => {
    setUpdateCustom(data);
    setShowUpdate(true);
  };

  const handleUpdateField = (e, field) => {
    // debugger;
    var updateis = updateCustom;
    updateis[field] = parseInt(e.target.value);
    setUpdateCustom(updateis);
    setFieldValue(fieldValue + 1);
  };

  ////////////////////// Searching function ////////////////////////

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          // ref={(node) => {
          //   this.searchInput = node;
          // }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="add-package-button"
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined className="icon-search" />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            type="primary"
            className="add-package-button"
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setsearchedColumn(dataIndex);
              setsearchText(selectedKeys[0]);
            }}
            style={{ color: "#149e7a" }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    // onFilterDropdownVisibleChange: (visible) => {
    //   if (visible) {
    //     setTimeout(() => this.searchInput.select(), 100);
    //   }
    // },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  ////////////////////// Handle For Search ////////////////////////

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setsearchedColumn(dataIndex);
    setsearchText(selectedKeys[0]);
  };

  ////////////////////// Handle For Resetting Search ////////////////////////

  const handleReset = (clearFilters) => {
    clearFilters();
    setsearchText("");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 160,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      // ...getColumnSearchProps("name") !== undefined
      // ? ...getColumnSearchProps("name")
      // :""

      // ...this.getColumnSearchProps("name"),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      width: 160,
      filters: [
        {
          text: "Instructor",
          value: "Instructor",
        },
        {
          text: "DSInstructor",
          value: "DSInstructor",
        },

        {
          text: "DrivingSchool",
          value: "DrivingSchool",
        },
        {
          text: "CarRentalAgent",
          value: "CarRentalAgent",
        },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: "Fields",
      dataIndex: "fields",
      key: "fields",
      align: "center",
      width: 160,
      // sorter: (a, b) => a.fields.length - b.fields.length,
      // ...this.getColumnSearchProps("fields"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 160,
      render: (data) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            style={{
              margin: "6px 6px 6px 6px",
              width: "10%",
              borderRadius: "50%",
            }}
          >
            <i
              style={{ fontSize: "20px" }}
              title="Edit"
              className="fa fa-pencil  package-icon simple-btn"
              onClick={() => handleUpdateClick(data)}
            ></i>
          </motion.div>
          <Popconfirm
            title="Are you sure want to delete this Custom limit?"
            onConfirm={() => handleDelete(data.user.id)}
            okText="Yes"
            cancelText="No"
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              style={{
                margin: "6px 6px 6px 6px",
                width: "10%",
                borderRadius: "50%",
              }}
            >
              <i
                style={{ fontSize: "20px" }}
                title="Delete"
                className="fa fa-trash simple-btn package-icon"
                // onClick={() => handleDelete(data.user.id)}
              ></i>
            </motion.div>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "300",
                color: "#333333",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              Custom Limits for users
            </h3>
            <div
              style={{
                float: "right",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                style={{
                  position: "relative",
                  zIndex: "1000",
                }}
                onClick={handleShow}
              >
                <div
                  style={{
                    backgroundColor: "#149e7a",
                    padding: "10px 15px 10px 15px",
                    borderRadius: "50%",
                    color: "white",
                    margin: "16px 20px 0px 2px",
                  }}
                >
                  <i className="fas fa-plus" style={{ color: "white" }}></i>
                </div>
              </motion.div>
            </div>
          </Col>
          <Col sm={12}>
            <Table
              // loading={{ indicator: antIcon }}
              style={{ padding: "5px 10px 5px 10px", whiteSpace: "pre" }}
              sticky={true}
              scroll={{ y: 434, x: 0 }}
              columns={columns}
              // onChange={this.onChange}
              pagination={{
                position: ["bottomCenter"],
                size: "small",
                showQuickJumper: true,
                defaultPageSize: 20,
                defaultCurrent: 1,
                showSizeChanger: true,
                pageSizeOptions: [20, 50, 100],

                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              dataSource={customValue.map((item, index) => ({
                name: item[0],
                role: item[1],
                fields: item[2],
                action: item[3],
              }))}
            ></Table>
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
          {/* <Button variant="secondary" onClick={handleShow}>
            Close
          </Button> */}
          <Button
            size="large"
            className="btn btn-success"
            onClick={AddRecordToDb}
            disabled={listAppend.length <= 0 || newCustom.user === undefined}
          >
            Add Record
          </Button>
        </Modal.Footer>
      </Modal>
      {/* update user special limitations */}
      <Modal show={showUpdate} onHide={handleUpdateShow}>
        <Modal.Header closeButton>
          <Modal.Title>Add Special Limitations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <ControlLabel>User</ControlLabel>
              <FormControl
                type="text"
                name="gender"
                value={
                  updateCustom
                    ? `${updateCustom.user.FirstName} ${updateCustom.user.SurName}`
                    : ""
                }
                readOnly={true}
              />
            </FormGroup>
            <Row>
              {updateCustom !== null ? (
                <React.Fragment>
                  {updateCustom.vehicleAddLimitInstructor ? (
                    <React.Fragment>
                      <Col sm={6}>
                        <FormGroup>
                          <ControlLabel>Field</ControlLabel>
                          <FormControl
                            type="text"
                            name="field"
                            value="Vehicle Add Limit"
                            readOnly={true}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={6}>
                        <FormGroup>
                          <ControlLabel>Value</ControlLabel>
                          <FormControl
                            type="number"
                            name="fieldvalue"
                            value={updateCustom.vehicleAddLimitInstructor}
                            min={1}
                            onChange={(e) =>
                              handleUpdateField(e, "vehicleAddLimitInstructor")
                            }
                          />
                        </FormGroup>
                      </Col>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                  {updateCustom.vehicleAddLimitDrivingSchool ? (
                    <React.Fragment>
                      <Col sm={6}>
                        <FormGroup>
                          <ControlLabel>Field</ControlLabel>
                          <FormControl
                            type="text"
                            name="field"
                            value="Vehicle Add Limit"
                            readOnly={true}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={6}>
                        <FormGroup>
                          <ControlLabel>Value</ControlLabel>
                          <FormControl
                            type="number"
                            name="fieldvalue"
                            value={updateCustom.vehicleAddLimitDrivingSchool}
                            min={1}
                            onChange={(e) =>
                              handleUpdateField(
                                e,
                                "vehicleAddLimitDrivingSchool"
                              )
                            }
                          />
                        </FormGroup>
                      </Col>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                  {updateCustom.instructorAddLimit ? (
                    <React.Fragment>
                      <Col sm={6}>
                        <FormGroup>
                          <ControlLabel>Field</ControlLabel>
                          <FormControl
                            type="text"
                            name="field"
                            value="Instructor Add Limit"
                            readOnly={true}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={6}>
                        <FormGroup>
                          <ControlLabel>Value</ControlLabel>
                          <FormControl
                            type="number"
                            name="fieldvalue"
                            value={updateCustom.instructorAddLimit}
                            min={1}
                            onChange={(e) =>
                              handleUpdateField(e, "instructorAddLimit")
                            }
                          />
                        </FormGroup>
                      </Col>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                </React.Fragment>
              ) : (
                ""
              )}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="large"
            className="btn btn-success"
            onClick={handleUpdateShow}
          >
            Close
          </Button>
          <Button
            size="large"
            className="btn btn-success"
            onClick={updateRecordToDb}
            disabled={updateCustom && updateCustom.user === undefined}
          >
            Update Record
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Limitaions;

// const columns = [
//   { title: "Name" },
//   { title: "Role" },
//   { title: "Fields" },
//   {
//     title: "Action",
//     value: "Action here",
//   },
// ];
