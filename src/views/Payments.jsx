import React, { Component } from "react";
import { Grid, Row, Col, Tabs, Tab } from "react-bootstrap";
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Translation } from "react-i18next";
// import { motion } from "framer-motion";

import WebServicesManager from "WebServicesManager/WebServicesManager";
import moment from "moment";

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

class Payments extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      inactiveusers: [],
      loading: true,
    };
  }
  componentWillMount() {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "Membership/GetAllActiveUsers",
        token: tokn,
      },
      (statusCode, responseMemeber) => {
        if (responseMemeber.length > 0) {
          responseMemeber.map((item) => {
            this.WebServicesManager.getApiWithParamCall(
              {
                endPoint: "Personal/GetAllById",
                dataToFetch: item.userId,
                token: tokn,
              },
              (statusCode, responseUser) => {
                // console.log("respisswe", responseUser, item);
                if (item.activated === "true") {
                  // debugger;
                  const resp = {
                    id: responseUser.id,
                    firstName: responseUser.firstName,
                    surName: responseUser.surName,
                    gender: responseUser.gender,
                    email: responseUser.email,
                    address: responseUser.address,
                    pkgActiveDate: moment(item.packageActivationDate).format(
                      "ddd MMM DD YYYY"
                    ),
                    pkgExpireDate: moment(item.packageExpiryDate).format(
                      "ddd MMM DD YYYY"
                    ),
                  };
                  // console.log("resp");
                  this.setState({ users: [...this.state.users, resp] });
                } else {
                  const resp = {
                    id: responseUser.id,
                    firstName: responseUser.firstName,
                    surName: responseUser.surName,
                    gender: responseUser.gender,
                    email: responseUser.email,
                    address: responseUser.address,
                    pkgActiveDate: moment(item.packageActivationDate).format(
                      "ddd MMM DD YYYY"
                    ),
                    pkgExpireDate: moment(item.packageExpiryDate).format(
                      "ddd MMM DD YYYY"
                    ),
                  };
                  this.setState({
                    inactiveusers: [...this.state.inactiveusers, resp],
                  });
                }
              }
            );

            return null;
          });
        }
        this.setState({ loading: false });
      }
    );
  }
  active = (e) => {
    var tokn = localStorage.getItem("userdata");
    alert("Payment Confirmed Successfully");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Membership/Activate",
        dataToFetch: e.target.value,
        token: tokn,
      },
      (s, r) => {
        //
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
        title: <Translation>{(t) => t("Verify")}</Translation>,
        dataIndex: "verify",
        key: "verify",
        align: "center",
        width: 160,
      },
      {
        title: <Translation>{(t) => t("Name")}</Translation>,
        dataIndex: "name",
        key: "name",
        width: 160,
        align: "center",
        sorter: (a, b) => a.name.length - b.name.length,
        ...this.getColumnSearchProps("name"),
      },

      {
        title: <Translation>{(t) => t("Gender")}</Translation>,
        dataIndex: "gender",
        key: "gender",
        width: 160,
        align: "center",
        sorter: (a, b) => a.gender.length - b.gender.length,
        ...this.getColumnSearchProps("gender"),
      },

      {
        title: <Translation>{(t) => t("Email")}</Translation>,
        dataIndex: "email",
        key: "email",
        width: 160,
        align: "center",
        sorter: (a, b) => a.email.length - b.email.length,
        ...this.getColumnSearchProps("email"),
      },
      {
        title: <Translation>{(t) => t("Address")}</Translation>,
        dataIndex: "address",
        key: "address",
        width: 160,
        align: "center",
        sorter: (a, b) => a.address.length - b.address.length,
        ...this.getColumnSearchProps("address"),
      },
      {
        title: <Translation>{(t) => t("Start Date")}</Translation>,
        dataIndex: "startDate",
        key: "startDate",
        width: 160,
        align: "center",
      },
      {
        title: <Translation>{(t) => t("Expiry Date")}</Translation>,
        dataIndex: "expiryDate",
        key: "expiryDate",
        width: 160,
        align: "center",
      },
    ];

    const columnsVerified = [
      {
        title: <Translation>{(t) => t("Name")}</Translation>,
        dataIndex: "name",
        key: "name",
        width: 160,
        align: "center",
        sorter: (a, b) => a.name.length - b.name.length,
        ...this.getColumnSearchProps("name"),
      },

      {
        title: <Translation>{(t) => t("Gender")}</Translation>,
        dataIndex: "gender",
        key: "gender",
        width: 160,
        align: "center",
        sorter: (a, b) => a.gender.length - b.gender.length,
        ...this.getColumnSearchProps("gender"),
      },

      {
        title: <Translation>{(t) => t("Email")}</Translation>,
        dataIndex: "email",
        key: "email",
        width: 160,
        align: "center",
        sorter: (a, b) => a.email.length - b.email.length,
        ...this.getColumnSearchProps("email"),
      },
      {
        title: <Translation>{(t) => t("Address")}</Translation>,
        dataIndex: "address",
        key: "address",
        width: 160,
        align: "center",
        sorter: (a, b) => a.address.length - b.address.length,
        ...this.getColumnSearchProps("address"),
      },
      {
        title: <Translation>{(t) => t("Start Date")}</Translation>,
        dataIndex: "startDate",
        key: "startDate",
        width: 160,
        align: "center",
      },
      {
        title: <Translation>{(t) => t("Expire Date")}</Translation>,
        dataIndex: "expiryDate",
        key: "expiryDate",
        width: 160,
        align: "center",
      },
    ];
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
                    {t("Payment Verification")}
                  </h3>
                  <div>
                    <Tabs
                      defaultActiveKey="inactiveuser"
                      transition={false}
                      id="noanim-tab-example"
                    >
                      <Tab eventKey="inactiveuser" title={t("Non Verified")}>
                        <div
                          style={{ padding: "10px 20px", marginTop: "5px" }}
                          className="table-responsive"
                        >
                          {/* <table className="table table-striped table-bordered">
                        <thead>
                          <th>Verify</th>
                          <th>Name</th>
                          <th>Gender</th>
                          <th>Email</th>
                          <th>Address</th>
                          <th>Start Date</th>
                          <th>Expire Date</th>
                        </thead>
                        <tbody>
                          {this.state.inactiveusers.length > 0 ? (
                            this.state.inactiveusers.map((item, idx) => {
                              return (
                                <tr>
                                  <td>
                                    <input
                                      type="checkbox"
                                      value={item.id}
                                      onChange={this.active}
                                    />
                                  </td>
                                  <td>{`${item.firstName} ${item.surName}`}</td>
                                  <td>{item.gender}</td>
                                  <td>{`${item.email}`}</td>
                                  <td>{item.address}</td>
                                  <td>{item.pkgActiveDate}</td>
                                  <td>{item.pkgExpireDate}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <td
                              colspan="7"
                              style={{
                                fontWeight: "bold",
                                textAlign: "center",
                                paddingTop: "30px",
                              }}
                            >
                              No Inactive User
                            </td>
                          )}
                        </tbody>
                      </table> */}
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
                            scroll={{ y: "70vh", x: 0 }}
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
                            dataSource={this.state.inactiveusers.map(
                              (item, index) => ({
                                key: index,
                                verify: "",
                                name: `${item.firstName} ${item.surName}`,
                                gender: item.gender,
                                email: item.email,
                                address: item.address,
                                startDate: item.pkgActiveDate,
                                expiryDate: item.pkgExpireDate,
                              })
                            )}
                          ></Table>
                        </div>
                      </Tab>
                      <Tab eventKey="activeusers" title={t("Verified")}>
                        <div
                          style={{ padding: "10px 10px", marginTop: "5px" }}
                          className="table-responsive"
                        >
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
                            scroll={{ y: "70vh", x: 0 }}
                            columns={columnsVerified}
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
                              name: `${item.firstName} ${item.surName}`,
                              gender: item.gender,
                              email: item.email,
                              address: item.address,
                              startDate: item.pkgActiveDate,
                              expiryDate: item.pkgExpireDate,
                            }))}
                          ></Table>
                        </div>
                      </Tab>
                    </Tabs>
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

export default Payments;
