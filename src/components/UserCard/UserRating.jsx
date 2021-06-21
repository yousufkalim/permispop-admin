import React, { Component } from "react";
import { Row } from "react-bootstrap";
import { Table, Button, Input, Space } from "antd";
import { Translation } from "react-i18next";
import { SearchOutlined, LoadingOutlined, StarFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Rating from "react-rating";
import moment from "moment";

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

class UserRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      users: [],
      loading: false,
      userDetails: [],
      pageNumber: 1,
      pageSize: 3,
    };
  }
  baseUrl = process.env.REACT_APP_BASE_URL;

  componentDidMount() {
    console.log(this.props);
    this.getUserRating();
    console.log("userrating component mount");
  }

  getUserRating = () => {
    const data = this.props;
    console.log("user data", data);
    var token = localStorage.getItem("userdata");
    const { pageNumber, pageSize } = this.state;
    console.log(token);
    console.log(this.props.id);
    const pagingParameters = { pageNumber: pageNumber, pageSize: pageSize };
    fetch(
      `${this.baseUrl}FeedBacks/GetRatingsById_New?id=${data.id}&Rating=0&PagingParameters=${pagingParameters}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      // .then((resp) => console.log("all response ", resp))
      .then((result) => result.json())
      .then((res) => {
        console.log("final data ", res);
        this.setState({ userDetails: res });
        console.log("userrating data ", res);
      })
      .catch((error) => console.log(`Error ${error}`));

    // this.WebServicesManager.getApiWithParamCall(
    //   {
    //     endPoint: `FeedBacks/GetRatingsById_New?id=${data.id}&Rating=3&PagingParameters=${pagingParameters}`,
    //     token: token,
    //   },
    //   (statusCode, response) => {
    //     console.log("response", response);
    //     this.setState({ userDetails: response });
    //   }
    // );
  };

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
    console.log("filters ", filters);
    console.log("page ", pagination);
    // console.log("params", pagination, filters, sorter, extra);
  };

  render() {
    const { pageNumber, pageSize } = this.state;
    console.log("user data ", this.state.userDetails);
    const columns = [
      {
        title: "Name",
        dataIndex: "ratingFrom",
        key: "ratingFrom",
        align: "center",
        fontWeight: 400,
        width: 150,

        sorter: (a, b) => a.ratingFrom - b.ratingFrom,
        ...this.getColumnSearchProps("ratingFrom"),
      },
      {
        title: <Translation>{(t) => t("Role")}</Translation>,
        dataIndex: "role",
        key: "role",
        align: "center",
        width: 130,
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
        onFilter: (value, record) => {
          console.log("value", value);
        },
        //  record.role.indexOf(value) === 0,
        sorter: (a, b) => a.role.length - b.role.length,
      },
      {
        title: <Translation>{(t) => t("Rating")}</Translation>,
        dataIndex: "rating",
        key: "rating",
        align: "center",
        width: 160,
        render: (rating) => (
          <Rating
            id={this.props.id}
            fractions={1}
            readonly={true}
            emptySymbol="far fa-star fa-2x fa-fw"
            fullSymbol="fa fa-star fa-2x fa-fw"
            initialRating={rating}
            // onChange={this.handleRating}
          ></Rating>
        ),
        filters: [
          {
            text: <StarFilled />,
            value: 1,
          },
          {
            text: (
              <span className="d-flex">
                <StarFilled />
                <StarFilled />
              </span>
            ),
            value: 2,
          },
          {
            text: (
              <span className="d-flex">
                <StarFilled />
                <StarFilled />
                <StarFilled />
              </span>
            ),
            value: 3,
          },
          {
            text: (
              <span className="d-flex">
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
              </span>
            ),
            value: 4,
          },
          {
            text: (
              <span className="d-flex">
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
              </span>
            ),
            value: 5,
          },
        ],
        onFilter: (value, record) => record.rating,
        sorter: (a, b) => a.rating.length - b.rating.length,
      },
      {
        title: "Rating Date",
        dataIndex: "feedBackDate",
        key: "feedBackDate",
        align: "center",
        fontWeight: 400,
        width: 120,
        render: (feedBackDate) => (
          <div>{moment(feedBackDate).format("DD/MM/YYYY")}</div>
        ),
      },
    ];
    return (
      <div>
        <Row className="table-responseive" style={{ margin: 10 }}>
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
              defaultPageSize: pageSize,
              defaultCurrent: 1,
              showSizeChanger: true,
              pageSizeOptions: [20, 50, 100],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            dataSource={
              this.state.userDetails !== undefined
                ? this.state.userDetails.map((item, index) => ({
                    key: index + 1,
                    name: item.firstName,
                    ratingFrom: `${item.firstName} ${item.surname}`,
                    role: item.role,
                    rating: item.rating,
                    feedBackDate: item.feedBackDate,
                  }))
                : ""
            }
          ></Table>
        </Row>
      </div>
    );
  }
}

export default UserRating;
