import React, { Component } from "react";
import { Grid, Row, Col, Tabs, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Input, Space } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { motion } from "framer-motion";
import { Translation } from "react-i18next";

// import { Card } from "components/Card/Card.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

export class UpdateRequest extends Component {
  WebServicesManager = new WebServicesManager();
  baseUrl = process.env.REACT_APP_BASE_URL;
  constructor(props) {
    super(props);
    this.state = {
      pendingRequest: [],
      completed: [],
      loading: true,

      // searching/ paging
      isVerified: false,
      name: "",
      updateField: "",
      pageSize: 10,
      pageNumber: 1,
      total: 0,
    };
  }

  componentDidMount() {
    //   makeing api call for getting all request for admin
    this.loadData();
  }

  loadData = () => {
    const { pageSize, pageNumber, isVerified, name, updateField } = this.state;
    this.setState({
      pendingRequest: [],
      completed: [],
    });
    var token = localStorage.getItem("userdata");

    //  &QuerySearch.UpdateField=${updateField}
    fetch(
      `${this.baseUrl}Profile/GetAllRequestForAdmin_New?isVerified=${isVerified}&pageSize=${pageSize}&pageNumber=${pageNumber}&QuerySearch.firstName=${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        // body: JSON.stringify(pagingParameters),
      }
    )
      .then((result) => result.json())
      .then((response) => {
        console.log("total ", response);
        const responseRequest = response.data;

        responseRequest.length > 0
          ? this.setState({ total: response.totalCount })
          : this.setState({ total: 0 });
        // console.log("responseRequest", responseRequest);
        var pendingList = [];
        var completeList = [];
        if (responseRequest && responseRequest.length > 0) {
          responseRequest.map((request) => {
            if (request.resolved) {
              completeList.push({ ...request, user: JSON.parse(request.user) });
            } else {
              pendingList.push({ ...request, user: JSON.parse(request.user) });
            }
            return null;
          });
          this.setState({
            pendingRequest: pendingList,
            completed: completeList,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log("errorrr ", err);
      });
  };

  tabHandler = (k) => {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk--------->", k);
    let isverified;
    this.setState({ loading: true });
    if (k === "completed") {
      this.setState(
        {
          isVerified: true,
          sortOrder: "ascend",
          sortValue: "firstName",
          pageNumber: 1,
          pageSize: 10,
          name: "",
          updateField: "",
          loading: false,
        },
        () => {
          this.loadData();
          // this.handleResetUpdateField();
          // this.handleReset();
        }
      );
    } else {
      this.setState(
        {
          isVerified: false,
          sortOrder: "ascend",
          sortValue: "firstName",
          pageNumber: 1,
          pageSize: 10,
          name: "",
          updateField: "",
          loading: false,
        },
        () => {
          this.loadData();
          // this.handleResetUpdateField();
          // this.handleReset();
        }
      );
    }
  };

  MakeRequestComplete = (id) => {
    var token = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: `Profile/updateRequestStatus?id=${id}`,
        token,
      },
      (statusCode, returnStatus) => {
        this.loadData();
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
      <Translation>
        {(t) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={(node) => {
                this.searchInput = node;
              }}
              placeholder={t("Search Name")}
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
                onClick={() =>
                  this.handleSearch(selectedKeys, confirm, dataIndex)
                }
                icon={<SearchOutlined className="icon-search" />}
                size="small"
                style={{ width: 100 }}
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
        )}
      </Translation>
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

  getColumnSearchPropsUpdateField = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <Translation>
        {(t) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={(node) => {
                this.searchInput = node;
              }}
              placeholder={t("Search")}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                this.handleSearchUpdateField(selectedKeys, confirm, dataIndex)
              }
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                className="add-package-button"
                type="primary"
                onClick={() =>
                  this.handleSearchUpdateField(selectedKeys, confirm, dataIndex)
                }
                icon={<SearchOutlined className="icon-search" />}
                size="small"
                style={{ width: 100 }}
              >
                <Translation>{(t) => t("Search")}</Translation>
              </Button>
              <Button
                type="primary"
                className="add-package-button"
                onClick={() => this.handleResetUpdateField(clearFilters)}
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
        )}
      </Translation>
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
    this.setState(
      {
        name: selectedKeys[0],
        searchedColumn: dataIndex,
      },
      () => {
        this.loadData();
      }
    );
  };

  handleSearchUpdateField = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState(
      {
        updateField: selectedKeys[0],
        searchedColumn: dataIndex,
      },
      () => {
        this.loadData();
      }
    );
  };

  ////////////////////// Handle For Resetting Search ////////////////////////

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ name: "" }, () => {
      this.loadData();
    });
  };

  handleResetUpdateField = (clearFilters) => {
    clearFilters();
    this.setState({ updateField: "" }, () => {
      this.loadData();
    });
  };

  ////////////////////// On Filter / Sorter / Pagination change ////////////////////////

  onChange = (pagination, filters, sorter, extra) => {
    console.log("pagination ", pagination);
    this.setState(
      {
        loading: false,
        pageSize: pagination.pageSize,
        pageNumber: pagination.current,
        // sortOrder: sorter.order ? sorter.order : "ascend",
        // sortValue: sorter.field,
      },
      () => {
        console.log("load data done");
        this.loadData();
      }
    );
    // console.log("params", pagination, filters, sorter, extra);
  };

  render() {
    const columns = [
      ////////////////// Responsive XS //////////////////////
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 50,
        align: "center",
        responsive: ["xs"],
        sorter: (a, b) => "",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Update Field",
        dataIndex: "field",
        width: 100,
        responsive: ["xs"],
        key: "field",
        align: "center",
        // sorter: (a, b) => "",
        // ...this.getColumnSearchPropsUpdateField("field"),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 100,
        responsive: ["xs"],
        align: "center",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 150,
        responsive: ["xs"],
        align: "center",
        render: (item) => (
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
                className="fas fa-check  package-icon simple-btn"
                onClick={() => this.MakeRequestComplete(item.id)}
              ></i>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              style={{
                margin: "6px 6px 6px 6px",
                width: "10%",
                borderRadius: "50%",
              }}
            >
              <Link
                to={{
                  pathname: "/admin/users",
                  user_id: item.user.id,
                }}
              >
                <i
                  style={{ fontSize: "20px", marginLeft: "10px" }}
                  title="Edit"
                  className="fas fa-edit  package-icon simple-btn"
                ></i>
              </Link>
            </motion.div>
          </div>
        ),
      },

      ////////////////// Responsive Normal //////////////////////
      {
        title: <Translation>{(t) => t("Name")}</Translation>,
        dataIndex: "name",
        key: "name",
        align: "center",
        responsive: ["sm"],
        sorter: (a, b) => "",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: <Translation>{(t) => t("Update Field")}</Translation>,
        dataIndex: "field",
        key: "field",
        responsive: ["sm"],
        align: "center",
        // sorter: (a, b) => "",
        // ...this.getColumnSearchPropsUpdateField("field"),
      },
      {
        title: <Translation>{(t) => t("Description")}</Translation>,
        dataIndex: "description",
        key: "description",
        responsive: ["sm"],
        align: "center",
      },
      {
        title: <Translation>{(t) => t("Action")}</Translation>,
        dataIndex: "action",
        key: "action",
        responsive: ["sm"],
        align: "center",
        render: (item) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Button
              size="large"
              className="btn btn-success"
              style={{ margin: "5px 10px" }}
              onClick={() => this.MakeRequestComplete(item.id)}
            >
              <Translation>{(t) => t("Complete")}</Translation>
            </Button>
            <Link
              to={{
                pathname: "/admin/users",
                user_id: item.user.id,
              }}
            >
              <Button
                size="large"
                className="btn btn-success"
                style={{ margin: "5px 10px" }}
              >
                <Translation>{(t) => t("Update Profile")}</Translation>
              </Button>
            </Link>
          </div>
        ),
      },
    ];
    const columnsCompleted = [
      {
        title: <Translation>{(t) => t("Name")}</Translation>,
        dataIndex: "name",
        key: "name",
        align: "center",
        width: 160,
        sorter: (a, b) => "",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: <Translation>{(t) => t("Update Field")}</Translation>,
        dataIndex: "field",
        key: "field",
        align: "center",
        width: 160,
        // sorter: (a, b) => "",
        // ...this.getColumnSearchPropsUpdateField("field"),
      },
      {
        title: <Translation>{(t) => t("Description")}</Translation>,
        dataIndex: "description",
        key: "description",
        align: "center",
        width: 160,
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
                    {t("Update Profile Data Request")}
                  </h3>
                  <div>
                    <Tabs
                      defaultActiveKey="pending"
                      transition="false"
                      id="noanim-tab-example"
                      onSelect={(k) => this.tabHandler(k)}
                    >
                      <Tab eventKey="pending" title={t("Pending")}>
                        <div
                          style={{ padding: "10px 20px", marginTop: "5px" }}
                          className="table-responsive"
                        >
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
                            scroll={{ y: 434, x: 300 }}
                            columns={columns}
                            // onChange={this.onChange}
                            pagination={{
                              position: ["bottomCenter"],
                              size: "small",
                              showQuickJumper: true,
                              defaultPageSize: 10,
                              defaultCurrent: 1,
                              total: this.state.total,
                              showSizeChanger: true,
                              pageSizeOptions: [10, 20, 50, 100],

                              showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} Lignes`,
                            }}
                            dataSource={this.state.pendingRequest.map(
                              (item, index) => ({
                                key: index,
                                name: `${item.user.firstName} ${item.user.surName}`,
                                action: item,
                                description: item.description,
                                field: t(item.updateField),
                              })
                            )}
                          ></Table>
                        </div>
                      </Tab>
                      <Tab eventKey="completed" title={t("Completed")}>
                        <div
                          style={{ padding: "10px 10px", marginTop: "5px" }}
                          className="table-responsive"
                        >
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
                            scroll={{ y: "70vh", x: 0 }}
                            columns={columnsCompleted}
                            pagination={{
                              position: ["bottomCenter"],
                              size: "small",
                              showQuickJumper: true,
                              defaultPageSize: 10,
                              defaultCurrent: 1,
                              showSizeChanger: true,
                              total: this.state.total,
                              pageSizeOptions: [10, 20, 50, 100],

                              showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} Lignes`,
                            }}
                            dataSource={
                              this.state.completed.length > 0
                                ? this.state.completed.map((item, index) => ({
                                    key: index,
                                    name: `${item.user.firstName} ${item.user.surName}`,
                                    description: item.description,
                                    field: t(item.updateField),
                                  }))
                                : ""
                            }
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

export default UpdateRequest;
