import React, { Component } from "react";
import Dispute from "components/Disputes/Dispute.jsx";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { motion } from "framer-motion";

class Disputes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      disputeId: "0",
      users: [],
    };
  }

  WebServicesManager = new WebServicesManager();
  componentWillMount() {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "Dispute/GetAllDisputesForAdmin",
        token: tokn,
      },
      (s, r) => {
        if (r !== null) this.setState({ users: r });
      }
    );
  }
  toggle = (id) => {
    this.setState(
      {
        disputeId: id,
      },
      this.setState({ showDetails: !this.state.showDetails })
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
        title: "Disputes",
        children: [
          {
            title: "Sr. #",
            dataIndex: "number",
            key: "number",
            align: "center",
            width: 100,
            sorter: (a, b) => a.number.length - b.number.length,
            ...this.getColumnSearchProps("number"),
          },
        ],
      },
      {
        title: "Raised By",
        children: [
          {
            title: "Name",
            dataIndex: "nameRB",
            key: "nameRB",
            align: "center",
            width: 100,
            sorter: (a, b) => a.nameRB.length - b.nameRB.length,
            ...this.getColumnSearchProps("nameRB"),
          },
          {
            title: "Role",
            dataIndex: "roleRB",
            key: "roleRB",
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
            ],
            onFilter: (value, record) => record.roleRB.indexOf(value) === 0,
            sorter: (a, b) => a.roleRB.length - b.roleRB.length,
          },
        ],
      },

      {
        title: "Raised Against",
        children: [
          {
            title: "Name",
            dataIndex: "nameRA",
            key: "nameRA",
            align: "center",
            width: 100,
            sorter: (a, b) => a.nameRA.length - b.nameRA.length,
            ...this.getColumnSearchProps("nameRA"),
          },
          {
            title: "Role",
            dataIndex: "roleRA",
            key: "roleRA",
            align: "center",
            width: 200,
            filters: [
              {
                text: "Instructor/DrivingSchool",
                value: "Instructor/DrivingSchool",
              },
            ],
            onFilter: (value, record) => record.roleRA.indexOf(value) === 0,
            sorter: (a, b) => a.roleRA.length - b.roleRA.length,
          },
        ],
      },
      {
        title: "",
        children: [
          {
            title: "Comments",
            dataIndex: "comments",
            key: "comments",
            align: "center",
            width: 160,
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 160,
          },
          {
            title: "View details",
            dataIndex: "details",
            key: "details",
            align: "center",
            width: 160,
            render: (id) => (
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
                  onClick={(e) => {
                    this.toggle(id);
                  }}
                  style={{ margin: "6px 14px 6px 14px" }}
                >
                  <i
                    title="View More"
                    className=" fas fa-eye fa-2x package-icon"
                  ></i>
                </motion.div>
              </div>
            ),
          },
        ],
      },
    ];
    if (this.state.showDetails)
      return <Dispute toggle={this.toggle} id={this.state.disputeId}></Dispute>;
    else
      return (
        <div className="content">
          <Grid fluid>
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
                  Disputes
                </h3>
                <div className="table-responsive">
                  {/* <Table bordered>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#149e7a",
                          color: "#fff",
                        }}
                      >
                        <td className="text-center">Disputes</td>
                        <td className="text-center" colSpan="2">
                          Raised By
                        </td>
                        <td className="text-center" colSpan="2">
                          Raised against
                        </td>
                        <td className="text-center"></td>
                        <td className="text-center" colSpan="2"></td>
                      </tr>
                      <tr
                        style={{
                          backgroundColor: "#ffb733",
                          color: "#fff",
                        }}
                      >
                        <td className="text-center">#</td>
                        <td className="text-center">Name</td>
                        <td className="text-center">Role</td>
                        <td className="text-center">Name</td>
                        <td className="text-center">Role</td>
                        <td className="text-center">Comments</td>
                        <td className="text-center">status</td>
                        <td className="text-center">view details</td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.users.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {console.log("props are", prop)}
                            <td className="text-center">{key + 1}</td>
                            <td className="text-center">
                              {prop.disputingFrom.toLowerCase() === "student"
                                ? prop.studentID
                                : prop.instructorID}
                            </td>
                            <td className="text-center">
                              {prop.disputingFrom}
                            </td>
                            <td className="text-center">
                              {prop.disputingFrom.toLowerCase() === "student"
                                ? prop.instructorID
                                : prop.studentID}
                            </td>
                            <td className="text-center">
                              {prop.disputingFrom.toLowerCase() !== "student"
                                ? "Student"
                                : "Instructor/DrivingSchool"}
                            </td>
                            <td className="text-center">
                              {prop.adminComments !== null &&
                              prop.adminComments !== "null"
                                ? prop.adminComments
                                : "No Comment"}
                            </td>
                            <td className="text-center">
                              {prop.status !== null && prop.status !== "null"
                                ? prop.status
                                : "Pending"}
                            </td>
                            <td className="text-center">
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => {
                                  this.toggle(prop.id);
                                }}
                                style={{ margin: "6px 14px 6px 14px" }}
                              >
                                <i
                                  title="View More"
                                  className=" fas fa-eye fa-2x package-icon"
                                ></i>
                              </motion.div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table> */}
                  <Table
                    style={{ padding: "5px 10px 5px 10px" }}
                    sticky={true}
                    scroll={{ y: 434 }}
                    columns={columns}
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
                    dataSource={this.state.users.map((item, index) => ({
                      key: index,
                      number: index + 1,
                      nameRB:
                        item.disputingFrom.toLowerCase() === "student"
                          ? item.studentID
                          : item.instructorID,
                      roleRB: item.disputingFrom,
                      nameRA:
                        item.disputingFrom.toLowerCase() === "student"
                          ? item.instructorID
                          : item.studentID,
                      roleRA:
                        item.disputingFrom.toLowerCase() !== "student"
                          ? "Student"
                          : "Instructor/DrivingSchool",
                      comments:
                        item.adminComments !== null &&
                        item.adminComments !== "null"
                          ? item.adminComments
                          : "No Comment",
                      status:
                        item.status !== null && item.status !== "null"
                          ? item.status
                          : "Pending",
                      details: item.id,
                    }))}
                  ></Table>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      );
  }
}

export default Disputes;
