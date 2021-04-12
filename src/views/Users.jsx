import React, { Component } from "react";
import { Grid, Row, Col, Tabs, Tab, TabContainer } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import UserCard from "components/UserCard/UserCard.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import UserDocuments from "components/UserCard/UserDocuments.jsx";
import UserPayments from "components/UserCard/UserPayments.jsx";
import UserInstructors from "components/UserCard/UserInstructors.jsx";
import UserMeetups from "components/UserCard/UserMeetups.jsx";
import "font-awesome/css/font-awesome.min.css";
import { motion } from "framer-motion";
import { Table, Button, Input, Space } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const $ = require("jquery");
$.DataTable = require("datatables.net");

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      nonVarifiedUser: [],
      verfiedUser: [],
      users: [],
      showDetails: false,
      userDetails: {},
      documentVerified: "",
      dataV: {},
      dataNV: {},
      defualtTab: "documents",
      searchText: "",
      searchedColumn: "",
      loading: true,
    };
  }
  WebServicesManager = new WebServicesManager();

  componentWillMount() {
    var nonVerified = [];
    var verfied = [];
    var VerifiedUser = [];
    var NonVerifiedUser = [];
    var vc = 1,
      nvc = 1;
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "Personal/GetAllUsers",
        token: tokn,
      },
      (statusCode, response) => {
        console.log("response", response);
        response.map((item) => {
          if (
            item.role !== "Admin" &&
            item.role !== "Email" &&
            item.role !== "DSInstructor" &&
            !item.role.includes("Delete")
          ) {
            if (item.documentTested === "Tested") {
              VerifiedUser.push({
                key: vc,
                name: item.firstName + " " + item.surName,
                role: item.role,
                active: true,
                docV: true,
                details: item,
              });
              vc = vc + 1;
            } else {
              NonVerifiedUser.push({
                key: nvc,
                name: item.firstName + " " + item.surName,
                role: item.role,
                active: true,
                docV: false,
                details: item,
              });
              nvc = nvc + 1;
            }
          }
          this.setState({ loading: false });

          return null;
        });
        var verifiedUserData = { rows: VerifiedUser };
        var nonVerifiedUserData = { rows: NonVerifiedUser };
        this.setState(
          {
            allUsers: response,
            verfiedUser: verfied,
            nonVarifiedUser: nonVerified,
            dataV: verifiedUserData,
            dataNV: nonVerifiedUserData,
          },
          () => {
            setTimeout(() => {
              var link_id = this.props.location.user_id;
              if (link_id !== undefined) {
                // var element = document.getElementById("5fec10f2f4d2a1176c70a0f6");
                var element = document.getElementById(link_id);
                if (element !== null) {
                  element.click();
                }
              }
            }, 100);
          }
        );
      }
    );
  }
  handleClick(obj) {
    this.setState({ showDetails: !this.state.showDetails, userDetails: obj });
  }
  changeUser = (id) => {
    var token = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Personal/GetAllById",
        dataToFetch: id,
        token,
      },
      (statusCode, responseUser) => {
        this.setState({ userDetails: responseUser, defualtTab: "documents" });
      }
    );
  };
  ////////////////////// Searching function ////////////////////////

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="add-package-button"
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined className="icon-search" />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            type="primary"
            className="add-package-button"
            onClick={() => this.handleReset(clearFilters)}
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
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
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
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  ////////////////////// Handle For Search ////////////////////////

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  ////////////////////// Handle For Resetting Search ////////////////////////

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  ////////////////////// On Filter / Sorter / Pagination change ////////////////////////

  onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };
  render() {
    const columns = [
      {
        title: "SR. #",
        dataIndex: "number",
        key: "number",
        align: "center",
        fontWeight: 400,
        width: 100,

        sorter: (a, b) => a.number - b.number,
        ...this.getColumnSearchProps("number"),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "center",
        width: 160,
        sorter: (a, b) => a.name.length - b.name.length,
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        align: "center",
        width: 160,
        filters: [
          {
            text: "Student",
            value: "Student",
          },
          {
            text: "Instructor",
            value: "Instructor",
          },
          {
            text: "Driving School",
            value: "DrivingSchool",
          },
          {
            text: "Car Rental Agent",
            value: "CarRentalAgent",
          },
        ],
        onFilter: (value, record) => record.role.indexOf(value) === 0,
        sorter: (a, b) => a.role.length - b.role.length,
      },
      {
        title: "Active",
        dataIndex: "active",
        key: "active",
        align: "center",
        width: 160,
        render: (active) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {active === true ? (
              <i className="fa fa-check" style={{ color: "green" }}></i>
            ) : (
              <i className="fa fa-remove" style={{ color: "red" }}></i>
            )}
          </div>
        ),
      },
      {
        title: "Document Verified",
        dataIndex: "docV",
        key: "docV",
        align: "center",
        width: 160,
        render: (docV) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {docV === true ? (
              <i className="fa fa-check" style={{ color: "green" }}></i>
            ) : (
              <i className="fa fa-remove" style={{ color: "red" }}></i>
            )}
          </div>
        ),
      },
      {
        title: "View Details",
        dataIndex: "details",
        key: "details",
        align: "center",
        width: 160,
        render: (detail) => (
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
                title="View More"
                className="fa fa-eye fa-2xl  package-icon simple-btn"
                onClick={() => this.handleClick(detail)}
              ></i>
            </motion.div>
          </div>
        ),
      },
    ];
    return (
      <div className="content">
        <Grid fluid>
          {this.state.showDetails ? (
            <Row>
              <Row>
                <div
                  style={{
                    float: "left",
                    margin: "-20px 0px 6px 20px",
                  }}
                >
                  <motion.div
                    title="Go Back"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    style={{
                      position: "relative",
                      zIndex: "1000",
                    }}
                    // onClick={this.props.toggle}
                    onClick={() => window.location.reload()}
                  >
                    <a href="/admin/users">
                      <i
                        className="fas fa-arrow-left fa-2x"
                        style={{ color: "#149e7a" }}
                      ></i>
                    </a>
                  </motion.div>
                </div>
                {/* <Col md={12}>
                  <a
                    href="/admin/users"
                    onClick={() => window.location.reload()}
                  >
                    {" "}
                    <i className="fa fa-arrow-circle-left"></i>Back to list
                  </a>
                </Col> */}
              </Row>
              <Row>
                <Col md={4}>
                  <UserCard
                    bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                    {...this.state.userDetails}
                  />
                  {/* {console.log("...this.state.userDetails", {
                    ...this.state.userDetails,
                  })} */}
                </Col>
                <Col md={8}>
                  <Card
                    title=""
                    category=""
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <TabContainer id="content" className="content">
                        <Tabs defaultActiveKey={this.state.defualtTab}>
                          <Tab eventKey="documents" title="Documents">
                            <UserDocuments {...this.state.userDetails} />
                          </Tab>

                          {/* instructor tabs */}
                          {this.state.userDetails.role === "DrivingSchool" ? (
                            <Tab eventKey="instructor" title="Instructor">
                              <UserInstructors
                                {...this.state.userDetails}
                                changeUser={this.changeUser}
                              />
                            </Tab>
                          ) : (
                            ""
                          )}
                          {/* meetup tabs */}
                          {this.state.userDetails.role === "Instructor" ||
                          this.state.userDetails.role === "DSInstructor" ||
                          this.state.userDetails.role === "CarRentalAgent" ? (
                            <Tab eventKey="meetup" title="Meetup Points">
                              <UserMeetups {...this.state.userDetails} />
                            </Tab>
                          ) : (
                            ""
                          )}
                          <Tab eventKey="Payments" title="Payments">
                            <UserPayments {...this.state.userDetails} />
                          </Tab>
                        </Tabs>
                      </TabContainer>
                    }
                  />
                </Col>
              </Row>
            </Row>
          ) : (
            <Row>
              <Col md={12}>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "300",
                    color: "#333333",
                    marginTop: "-10px",
                    marginBottom: "20px",
                  }}
                >
                  Users
                </h3>
                <Tabs defaultActiveKey="inactiveuser" id="noanim-tab-example">
                  <Tab eventKey="inactiveuser" title="Non Verified">
                    <Row className="table-responseive" style={{ margin: 10 }}>
                      {/* <MDBDataTable
                        bordered
                        data={this.state.dataNV}
                        className="dataTableNew"
                        entries
                        Options={[20, 50, 100]}
                      /> */}
                      <Table
                        loading={{
                          indicator: antIcon,
                          spinning: this.state.loading,
                          size: "large",
                        }}
                        locale={
                          this.state.loading
                            ? {
                                emptyText: (
                                  <div>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                  </div>
                                ),
                              }
                            : {}
                        }
                        style={{ padding: "5px 10px 5px 10px" }}
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
                        dataSource={
                          this.state.dataNV.rows !== undefined
                            ? this.state.dataNV.rows.map((item, index) => ({
                                key: index + 1,
                                number: item.key,
                                name: item.name,
                                role: item.role,
                                active: item.active,
                                docV: item.docV,
                                details: item.details,
                              }))
                            : ""
                        }
                      ></Table>
                    </Row>
                  </Tab>
                  <Tab eventKey="verfied" title="Verified">
                    <Row className="table-responseive" style={{ margin: 10 }}>
                      {/* <MDBDataTable
                        bordered
                        data={this.state.dataV}
                        className="dataTableNew"
                        entriesOptions={[20, 50, 100]}
                      /> */}
                      <Table
                        // loading={{ indicator: antIcon }}
                        style={{ padding: "5px 10px 5px 10px" }}
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
                        dataSource={
                          this.state.dataNV.rows !== undefined
                            ? this.state.dataV.rows.map((item, index) => ({
                                key: index + 1,
                                number: item.key,
                                name: item.name,
                                role: item.role,
                                active: item.active,
                                docV: item.docV,
                                details: item.details,
                              }))
                            : ""
                        }
                      ></Table>
                    </Row>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}

export default Users;
