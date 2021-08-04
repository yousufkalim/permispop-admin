import React, { Component } from "react";
import Dispute from "components/Disputes/Dispute.jsx";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { motion } from "framer-motion";
import { Translation } from "react-i18next";

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

class Disputes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      disputeId: "0",
      users: [],
      loading: true,

      // Searching
      pageNumber: 1,
      pageSize: 10,
      createdByName: "",
      createdAgainstName: "",
      rolesCB: [],
    };
  }

  WebServicesManager = new WebServicesManager();
  baseUrl = process.env.REACT_APP_BASE_URL;
  // componentWillMount() {
  //   this.getAllDisputes();
  // }
  componentDidMount() {
    this.getAllDisputes();
  }

  getAllDisputes = () => {
    const { pageSize, pageNumber, createdAgainstName, rolesCB } = this.state;

    const pagingParameters = { pageSize, pageNumber };
    var tokn = localStorage.getItem("userdata");

    fetch(
      `${this.baseUrl}Dispute/GetAllDisputesForAdmin_New?pageSize=${pageSize}&pageNumber=${pageNumber}&QuerySearch.firstName=${createdAgainstName}&QuerySearch.Role=${rolesCB}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokn,
        },
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        console.log("response ", res.data);
        const data = res.data;
        this.setState({ users: data, loading: false });
        // console.log("response ", res);
      })
      .catch((err) => {
        console.log(err);
      });
    // this.WebServicesManager.getApiCall(
    //   {
    //     endPoint: "Dispute/GetAllDisputesForAdmin",
    //     token: tokn,
    //   },
    //   (s, r) => {
    //     console.log("all users ", r);
    //     if (r !== null) this.setState({ users: r });
    //     this.setState({ loading: false });
    //   }
    // );
  };
  toggle = (id) => {
    console.log("id is ", id);
    this.setState(
      {
        disputeId: id,
      },
      this.setState({ showDetails: !this.state.showDetails })
    );
  };

  ////////////////////// Searching function ////////////////////////

  getColumnSearchCreatedByName = (dataIndex) => ({
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
            this.handleSearchCBName(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="add-package-button"
            type="primary"
            onClick={() =>
              this.handleSearchCBName(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined className="icon-search" />}
            size="small"
            style={{ width: 90 }}
          >
            <Translation>{(t) => t("Search")}</Translation>
          </Button>
          <Button
            type="primary"
            className="add-package-button"
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            <Translation>{(t) => t("Reset")}</Translation>
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
            <Translation>{(t) => t("Filter")}</Translation>
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     ? record[dataIndex]
    //         .toString()
    //         .toLowerCase()
    //         .includes(value.toLowerCase())
    //     : "",
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

  getColumnSearchCreatedAgainstName = (dataIndex) => ({
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
            this.handleSearchCAName(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="add-package-button"
            type="primary"
            onClick={() =>
              this.handleSearchCAName(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined className="icon-search" />}
            size="small"
            style={{ width: 90 }}
          >
            <Translation>{(t) => t("Search")}</Translation>
          </Button>
          <Button
            type="primary"
            className="add-package-button"
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            <Translation>{(t) => t("Reset")}</Translation>
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
            <Translation>{(t) => t("Filter")}</Translation>
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     ? record[dataIndex]
    //         .toString()
    //         .toLowerCase()
    //         .includes(value.toLowerCase())
    //     : "",
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
            <Translation>{(t) => t("Search")}</Translation>
          </Button>
          <Button
            type="primary"
            className="add-package-button"
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            <Translation>{(t) => t("Reset")}</Translation>
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
            <Translation>{(t) => t("Filter")}</Translation>
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     ? record[dataIndex]
    //         .toString()
    //         .toLowerCase()
    //         .includes(value.toLowerCase())
    //     : "",
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

  handleSearchCBName = (selectedKeys, confirm, dataIndex) => {
    const { startDate, endDate, brand } = this.state;
    confirm();
    console.log("search ", selectedKeys);
    this.setState(
      {
        createdByName: selectedKeys[0],
      },
      () => {
        console.log("createdBy Name ", this.state.createdByName);
        // this.fetchAllBookings();
        this.getAllDisputes();
        console.log("filteres selec");
      }
    );
  };

  handleSearchCAName = (selectedKeys, confirm, dataIndex) => {
    const { startDate, endDate, brand } = this.state;
    confirm();
    console.log("search ", selectedKeys);
    this.setState(
      {
        createdAgainstName: selectedKeys[0],
      },
      () => {
        console.log("createdBy Name ", this.state.createdByName);
        // this.fetchAllBookings();
        this.getAllDisputes();
        console.log("filteres selec");
      }
    );
  };

  ////////////////////// Handle For Resetting Search ////////////////////////

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ name: "" });
  };

  ////////////////////// On Filter / Sorter / Pagination change ////////////////////////

  onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);

    console.log("roles ", filters);

    filters.roleRA &&
      this.setState({ rolesCB: filters.roleRA, loading: false }, () => {
        console.log("selected roles ", this.state.rolesCB);
        this.getAllDisputes();
      });
  };

  render() {
    const columns = [
      {
        title: <Translation>{(t) => t("Disputes")}</Translation>,
        children: [
          {
            title: "Sr. #",
            dataIndex: "number",
            key: "number",
            align: "center",
            width: 70,
            // sorter: (a, b) => a.number - b.number,
            // ...this.getColumnSearchProps("number"),
          },
        ],
      },
      {
        title: <Translation>{(t) => t("Raised By")}</Translation>,
        children: [
          {
            title: <Translation>{(t) => t("Name")}</Translation>,
            dataIndex: "nameRB",
            key: "nameRB",
            align: "center",
            width: 130,
            // sorter: (a, b) => a.nameRB.length - b.nameRB.length,
            // ...this.getColumnSearchCreatedByName("nameRB"),
          },
          {
            title: <Translation>{(t) => t("Role")}</Translation>,
            dataIndex: "roleRB",
            key: "roleRB",
            align: "center",
            width: 140,
            // filters: [
            //   {
            //     text: <Translation>{(t) => t("Student")}</Translation>,
            //     value: "Student",
            //   },
            //   {
            //     text: <Translation>{(t) => t("Instructor")}</Translation>,
            //     value: "Instructor",
            //   },
            //   {
            //     text: <Translation>{(t) => t("Driving School")}</Translation>,
            //     value: "DrivingSchool",
            //   },
            //   {
            //     text: <Translation>{(t) => t("Car Rental Agent")}</Translation>,
            //     value: "CarRentalAgent",
            //   },
            // ],
            // onFilter: (value, record) => record.roleRB.indexOf(value) === 0,
            // sorter: (a, b) => "",
          },
        ],
      },

      {
        title: <Translation>{(t) => t("Raised Against")}</Translation>,
        children: [
          {
            title: <Translation>{(t) => t("Name")}</Translation>,
            dataIndex: "nameRA",
            key: "nameRA",
            align: "center",
            width: 120,
            sorter: (a, b) => a.nameRA.length - b.nameRA.length,
            ...this.getColumnSearchCreatedAgainstName("nameRA"),
          },
          {
            title: <Translation>{(t) => t("Role")}</Translation>,
            dataIndex: "roleRA",
            key: "roleRA",
            align: "center",
            width: 140,
            filters: [
              {
                text: <Translation>{(t) => t("Student")}</Translation>,
                value: "Student",
              },
              {
                text: <Translation>{(t) => t("Instructor")}</Translation>,
                value: "Instructor",
              },
              {
                text: <Translation>{(t) => t("Driving School")}</Translation>,
                value: "DrivingSchool",
              },
              {
                text: <Translation>{(t) => t("Car Rental Agent")}</Translation>,
                value: "CarRentalAgent",
              },
            ],
            // onFilter: (value, record) => record.roleRA.indexOf(value) === 0,
            sorter: (a, b) => "",
          },
        ],
      },
      {
        title: "",
        children: [
          {
            title: <Translation>{(t) => t("Comments")}</Translation>,
            dataIndex: "comments",
            key: "comments",
            align: "center",
            width: 140,
          },
          {
            title: <Translation>{(t) => t("Status")}</Translation>,
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 160,
          },
          {
            title: <Translation>{(t) => t("View details")}</Translation>,
            dataIndex: "details",
            key: "details",
            align: "center",
            width: 100,
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
                    console.log("click id ", id);
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
        <Translation>
          {(t) => (
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
                      {t("Disputes")}
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
                        onChange={this.onChange}
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
                        scroll={{ y: 434 }}
                        columns={columns}
                        pagination={{
                          position: ["bottomCenter"],
                          size: "small",
                          showQuickJumper: true,
                          defaultPageSize: 10,
                          defaultCurrent: 1,
                          showSizeChanger: true,
                          pageSizeOptions: [10, 20, 50, 100],

                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                        }}
                        dataSource={
                          this.state.users &&
                          this.state.users.map((item, index) => ({
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
                                ? t(item.adminComments)
                                : t("No Comment"),
                            status:
                              item.status !== null && item.status !== "null"
                                ? t(item.status)
                                : t("Pending"),
                            details: item.id,
                          }))
                        }
                      ></Table>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </div>
          )}
        </Translation>
      );
  }
}

export default Disputes;
