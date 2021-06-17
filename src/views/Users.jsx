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
import { SearchOutlined, LoadingOutlined, StarFilled } from "@ant-design/icons";
import { Translation } from "react-i18next";
import Highlighter from "react-highlight-words";
import UserRating from "../components/UserCard/UserRating";
import Rating from "react-rating";

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
      key: "inactiveuser",
      allUsers: [],
      nonVarifiedUser: [],
      verfiedUser: [],
      users: [],
      showDetails: false,
      userDetails: {},
      documentVerified: "",
      pageNumber: 1,

      pageSize: 3,
      dataV: {},
      dataNV: {},
      activeTab: "inactiveuser",
      defualtTab: "documents",
      searchText: "",
      searchedColumn: "",
      loading: true,
      total: 0,
      sortValue: "FirstName",
      sortOrder: "ascend",
      modelName: "PersonalInfo",
      isVerified: false,
      nameFilter: "",
      roleFilter: [],
      averageRatingFilter: [],
    };
  }
  WebServicesManager = new WebServicesManager();
  baseUrl = process.env.REACT_APP_BASE_URL;
  // componentWillMount() {
  //   const isverified = false;
  //   const { pageSize, pageNumber } = this.state;
  //   console.log("hfdjhfjf");
  //   this.getAllUsers(pageSize, pageNumber, isverified);
  // }

  componentDidMount() {
    this.getAllUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isVerified,
      searchText,
      sortOrder,
      roleFilter,
      pageNumber,
      pageSize,
    } = this.state;

    if (
      prevState.isVerified !== isVerified ||
      prevState.searchText !== searchText ||
      prevState.sortOrder !== sortOrder ||
      prevState.roleFilter.length !== roleFilter.length ||
      prevState.pageSize !== pageSize ||
      prevState.pageNumber !== pageNumber
    ) {
      console.log("This Get all users function has been called");
      this.getAllUsers();
    }
    if (searchText.length > 0) {
      this.getAllUsers();
    }
  }

  getAllUsers = async (PageSize, PageNumber, isverified) => {
    var nonVerified = [];
    var verfied = [];
    var VerifiedUser = [];
    var NonVerifiedUser = [];
    var vc = 1,
      nvc = 1;
    var tokn = localStorage.getItem("userdata");
    // const { pageSize, pageNumber } = this.state;
    // console.log("api pagenumber ", pageNumber);
    // console.log("api pagenumber ", isverified);
    // const pagingParameters = { pageSize: pageSize, pageNumber: pageNumber };
    // console.log("paging parameteres ", pagingParameters);
    // console.log(pagingParameters);
    // debugger;
    const {
      sortOrder,
      sortValue,
      modelName,
      isVerified,
      pageNumber,
      pageSize,
      searchText,
      roleFilter,
    } = this.state;
    let usersUrl = `${this.baseUrl}FeedBacks/GetAllUsersRating_New?pagenumber=${pageNumber}&pagesize=${pageSize}&sortvalue=${sortValue}&ModelName=${modelName}&IsVerified=${isVerified}&sortorder=${sortOrder}`;
    if (searchText && searchText.length > 0) {
      usersUrl = `${usersUrl}&QuerySearch.FirstName=${searchText}`;
    }
    if (roleFilter && roleFilter.length > 0) {
      usersUrl = `${usersUrl}&QuerySearch.Role=${roleFilter}`;
    }
    await fetch(
      // `http://localhost:63539/api/Feedbacks/GetAllUsersRating_New?pagingParameters1=${pagingParameters}&pagingParameters=${pagingParameters}&isVerified=${isverified}`,
      // `http://localhost:63539/api/Feedbacks/GetAllUsersRating_New?pagingParameters.pageNumber=${pageNumber}&pagingParameters.pageSize=${pageSize}&isVerified=${isverified}`,
      //  `http://localhost:63539/api/Personal/GetAllUsers_New?pagingParameters.pageSize=${pageSize}&pagingParameters.pageNumber=${pageNumber}&pagingParameters.querySorting=name&pagingParameters.querySorting=descend&isVerified=${isverified}`,
      // `${this.baseUrl}Personal/GetAllUsers`,
      // `${this.baseUrl}FeedBacks/GetAllUsersRating_New?pagenumber=${pageNumber}&pagesize=${pageSize}&sortvalue=${sortValue}&ModelName=${modelName}&IsVerified=${isVerified}&sortorder=${sortOrder}`,
      usersUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokn,
        },
        // body: JSON.stringify(pagingParameters),
      }
    )
      .then((result) => result.json())
      .then((resp) => resp.data)
      .then((response) => {
        this.setState({ loading: false });
        console.log("new users ", response);
        console.log("response", response);
        console.log("totalcount ", response[0].totalCount);
        response.length > 0
          ? this.setState({ total: response[0].totalCount })
          : this.setState({ total: 0 });

        response.map((item) => {
          if (
            item.role !== "Admin" &&
            item.role !== "Email" &&
            item.role !== "DSInstructor" &&
            !item.role.includes("Delete")
          ) {
            console.log("averagecount ", item.ratingCount);
            if (item.documentTested === "Tested") {
              VerifiedUser.push({
                key: vc,
                name: item.firstName + " " + item.surname,
                role: item.role,
                active: true,
                docV: true,
                count: item.ratingCount,
                rating: item.averageRating,
                details: item,
              });
              console.log("verifiedusers ", VerifiedUser);
              vc = vc + 1;
            } else {
              console.log("averagecount ", item.ratingCount);
              NonVerifiedUser.push({
                key: nvc,
                name: item.firstName + " " + item.surname,
                role: item.role,
                active: true,
                docV: false,
                count: item.ratingCount,
                rating: item.averageRating,
                details: item,
              });
              console.log("nonverifiedusers ", NonVerifiedUser);

              nvc = nvc + 1;
            }
          }

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
      })
      .catch((error) => console.log(`Error ${error}`));
  };
  handleClick(obj) {
    this.setState({ showDetails: !this.state.showDetails, userDetails: obj });
  }

  tabHandler = (k) => {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk--------->", k);
    let isverified;
    this.setState({ loading: true });
    // const { pageNumber, pageSize } = this.state;
    if (k === "inactiveuser") {
      this.setState({ key: k });
      isverified = false;
      this.setState({
        isVerified: false,
        sortOrder: "ascend",
        sortValue: "FristName",
        pageNumber: 1,
        pageSize: 3,
        modelName: "PersonalInfo",
        searchText: "",
      });
      this.setState({ loading: false });
    } else {
      this.setState({ key: k });
      isverified = true;
      this.setState({
        isVerified: true,
        sortOrder: "ascend",
        sortValue: "FirstName",
        pageNumber: 1,
        pageSize: 3,
        modelName: "PersonalInfo",
        searchText: "",
      });
      this.setState({ loading: false });
    }
    // console.log(isverified);

    // const pageSize = 3;
    // const pageNumber = 1;
    // const name = "";
    // const roleFilter = [];
    // const averageRatingFilter = [];
    // console.log("new size", pageNumber);

    // this.setState({ key: k, pageSize: 1, pageNumber: 20 });
  };

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
      searchText: !selectedKeys[0] ? "" : selectedKeys[0],
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
    const { key } = this.state;
    console.log(filters);
    console.log("sorter ", sorter);
    console.log("paging", pagination);
    filters.name && this.setState({ nameFilter: filters.name[0] });
    filters.role && this.setState({ roleFilter: filters.role });
    filters.rating && this.setState({ averageRatingFilter: filters.rating });
    const pageNumber = pagination.current;
    const pageSize = pagination.pageSize;
    let isverified;

    console.log("updated pageNumber ", pageNumber);
    console.log("updated pageSize ", pageSize);
    // const { pageNumber, pageSize, key } = this.state;
    if (key === "inactiveuser") {
      isverified = false;
    } else {
      isverified = true;
    }

    this.setState({
      loading: true,
      sortOrder: sorter.order ? sorter.order : "ascend",
      pageSize: pagination.pageSize,
      pageNumber: pagination.current,
    });
    // this.getAllUsers(pageSize, pageNumber, isverified);
    console.log("updated pageNumber2 ", pageNumber);
    console.log("updated pageSize2 ", pageSize);

    // console.log("params", pagination, filters, sorter, extra);
  };

  render() {
    console.log("current key", this.state.total);
    console.log("role filter ", this.state.roleFilter);
    console.log("rating filter ", this.state.averageRatingFilter);
    // console.log("New pagenumber ", this.state.pageNumber);
    // console.log("New pagesize ", this.state.pageSize);
    const columns = [
      {
        title: "SR. #",
        dataIndex: "number",
        key: "number",
        align: "center",
        fontWeight: 400,
        width: 120,

        // sorter: (a, b) => a.number - b.number,
        // ...this.getColumnSearchProps("number"),
      },
      {
        title: <Translation>{(t) => t("Name")}</Translation>,
        dataIndex: "name",
        key: "name",
        align: "center",
        width: 160,
        sorter: (a, b) => a.name.length - b.name.length,
        ...this.getColumnSearchProps("name"),
      },
      {
        title: <Translation>{(t) => t("Role")}</Translation>,
        dataIndex: "role",
        key: "role",
        align: "center",
        width: 160,
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
        onFilter: (value, record) => record.role.indexOf(value) === 0,
        sorter: (a, b) => a.role.length - b.role.length,
      },
      {
        title: <Translation>{(t) => t("Active")}</Translation>,
        dataIndex: "active",
        key: "active",
        align: "center",
        width: 100,
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
        title: <Translation>{(t) => t("Average Rating")}</Translation>,
        dataIndex: "rating",
        key: "rating",
        align: "center",
        width: 160,
        render: (rating) => (
          <div
            className="user-rating-stars"
            style={{ display: "flex", gap: "5px", justifyContent: "center" }}
          >
            <Rating
              id={this.props.id}
              fractions={1}
              readonly={true}
              emptySymbol="far fa-star fa-2x fa-fw"
              fullSymbol="fa fa-star fa-2x fa-fw"
              initialRating={rating}
              // onChange={this.handleRating}
            ></Rating>
            {rating > 0 && <div className="pl-1">({rating})</div>}
          </div>
          // <div
          //   style={{
          //     display: "flex",
          //     alignItems: "center",
          //     flexDirection: "row",
          //     justifyContent: "center",
          //   }}
          // >
          //   {docV === true ? (
          //     <i className="fa fa-check" style={{ color: "green" }}></i>
          //   ) : (
          //     <i className="fa fa-remove" style={{ color: "red" }}></i>
          //   )}
          // </div>
        ),
        // filters: [
        //   {
        //     text: <StarFilled />,
        //     value: 1,
        //   },
        //   {
        //     text: (
        //       <span className="d-flex">
        //         <StarFilled />
        //         <StarFilled />
        //       </span>
        //     ),
        //     value: 2,
        //   },
        //   {
        //     text: (
        //       <span className="d-flex">
        //         <StarFilled />
        //         <StarFilled />
        //         <StarFilled />
        //       </span>
        //     ),
        //     value: 3,
        //   },
        //   {
        //     text: (
        //       <span className="d-flex">
        //         <StarFilled />
        //         <StarFilled />
        //         <StarFilled />
        //         <StarFilled />
        //       </span>
        //     ),
        //     value: 4,
        //   },
        //   {
        //     text: (
        //       <span className="d-flex">
        //         <StarFilled />
        //         <StarFilled />
        //         <StarFilled />
        //         <StarFilled />
        //         <StarFilled />
        //       </span>
        //     ),
        //     value: 5,
        //   },
        // ],
        onFilter: (value, record) => record.rating,
        // sorter: (a, b) => a.rating.length - b.rating.length,
      },
      {
        title: <Translation>{(t) => t("Count")}</Translation>,
        dataIndex: "count",
        key: "count",
        align: "center",
        width: 120,
        render: (count) => <div>{count}</div>,
      },
      {
        title: <Translation>{(t) => t("View Details")}</Translation>,
        dataIndex: "details",
        key: "details",
        align: "center",
        width: 130,
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
      <Translation>
        {(t) => (
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
                              <Tab eventKey="documents" title={t("Documents")}>
                                <UserDocuments {...this.state.userDetails} />
                              </Tab>

                              {/* instructor tabs */}
                              {this.state.userDetails.role ===
                              "DrivingSchool" ? (
                                <Tab
                                  eventKey="instructor"
                                  title={t("Instructor")}
                                >
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
                              this.state.userDetails.role ===
                                "CarRentalAgent" ? (
                                <Tab
                                  eventKey="meetup"
                                  title={t("Meetup Points")}
                                >
                                  <UserMeetups {...this.state.userDetails} />
                                </Tab>
                              ) : (
                                ""
                              )}
                              <Tab eventKey="Payments" title={t("Payments")}>
                                <UserPayments {...this.state.userDetails} />
                              </Tab>

                              <Tab eventKey="ratings" title={t("Ratings")}>
                                <UserRating {...this.state.userDetails} />
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
                      {t("Users")}
                    </h3>
                    <Tabs
                      activeKey={this.state.key}
                      onSelect={(k) => this.tabHandler(k)}
                      defaultActiveKey={this.state.activeTab}
                      id="noanim-tab-example"
                    >
                      <Tab eventKey="inactiveuser" title={t("Non Verified")}>
                        <Row
                          className="table-responseive"
                          style={{ margin: 10 }}
                        >
                          {/* <MDBDataTable
                        bordered
                        data={this.state.dataNV}
                        className="dataTableNew"
                        entries
                        Options={[20, 50, 100]}
                      /> */}
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
                            scroll={{ y: "60vh", x: 0 }}
                            columns={columns}
                            pagination={{
                              position: ["bottomCenter"],
                              size: "small",
                              showQuickJumper: true,
                              defaultPageSize: this.state.pageSize,
                              defaultCurrent: this.state.pageNumber,
                              total: this.state.total,
                              showSizeChanger: true,
                              pageSizeOptions: [3, 20, 50, 100],

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
                                    rating: item.rating,
                                    count: item.count,
                                    details: item.details,
                                  }))
                                : ""
                            }
                          ></Table>
                        </Row>
                      </Tab>
                      <Tab eventKey="verified" title={t("Verified")}>
                        <Row
                          className="table-responseive"
                          style={{ margin: 10 }}
                        >
                          {/* <MDBDataTable
                        bordered
                        data={this.state.dataV}
                        className="dataTableNew"
                        entriesOptions={[20, 50, 100]}
                      /> */}
                          <Table
                            // loading={{ indicator: antIcon }}
                            onChange={this.onChange}
                            style={{ padding: "5px 10px 5px 10px" }}
                            sticky={true}
                            scroll={{ y: "60vh", x: 0 }}
                            columns={columns}
                            // onChange={this.onChange}
                            pagination={{
                              position: ["bottomCenter"],
                              size: "large",
                              showQuickJumper: true,
                              defaultPageSize: this.state.pageSize,
                              defaultCurrent: this.state.pageNumber,
                              showSizeChanger: true,
                              // pageSize: this.state.pageSize,
                              total: this.state.total,
                              pageSizeOptions: [3, 20, 50, 100],

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
                                    rating: item.rating,
                                    count: item.count,
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
        )}
      </Translation>
    );
  }
}

export default Users;
