import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Table, Button, Input, Space } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import { Translation } from "react-i18next";

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

class PackageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      searchText: "",
      searchedColumn: "",
      loading: true,
    };
  }
  WebServicesManager = new WebServicesManager();

  componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "package/GetAllPackages",
        token: tokn,
      },
      (statusCode, pgkDetails) => {
        console.log("did mount package", this.state.packages);
        this.setState({ packages: pgkDetails });
        this.setState({ loading: false });
      }
    );
    this.setState({ loading: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.addUpdate !== prevProps.addUpdate) {
      var tokn = localStorage.getItem("userdata");
      this.WebServicesManager.getApiCall(
        {
          endPoint: "package/GetStudentPackages",
          token: tokn,
        },
        (statusCode, pgkDetails) => {
          this.setState({ packages: pgkDetails });
        }
      );
    }
    // console.log("did up", this.state.packages);
  }

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
          placeholder={`Rechercher`}
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

  ////////////////////// Render ////////////////////////

  render() {
    const columns = [
      {
        title: <Translation>{(t) => t("Sr. No.")}</Translation>,
        dataIndex: "number",
        key: "number",
        align: "center",
        fontWeight: 400,
        width: 100,
        sorter: (a, b) => a.number - b.number,
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
        title: <Translation>{(t) => t("Duration")}</Translation>,
        dataIndex: "duration",
        key: "duration",
        align: "center",
        width: 160,
        filters: [
          {
            text: <Translation>{(t) => t("Monthly")}</Translation>,
            value: "Monthly",
          },
          {
            text: <Translation>{(t) => t("Quarterly")}</Translation>,
            value: "Quarterly",
          },
          {
            text: <Translation>{(t) => t("Yearly")}</Translation>,
            value: "Yearly",
          },
        ],
        onFilter: (value, record) => record.duration.indexOf(value) === 0,
        sorter: (a, b) => a.duration.length - b.duration.length,
      },
      {
        title: <Translation>{(t) => t("Price")}</Translation>,
        dataIndex: "price",
        key: "price",
        align: "center",
        width: 160,
        sorter: (a, b) => a.price - b.price,
        ...this.getColumnSearchProps("price"),
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
            value: "Driving School",
          },
        ],
        onFilter: (value, record) => record.role.indexOf(value) === 0,
        sorter: (a, b) => a.role.length - b.role.length,
      },
    ];
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
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
                onChange={this.onChange}
                pagination={{
                  position: ["bottomCenter"],
                  size: "small",

                  defaultPageSize: 20,
                  defaultCurrent: 1,
                  showSizeChanger: true,
                  pageSizeOptions: [20, 50, 100],

                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} Lignes`,
                }}
                dataSource={this.state.packages.map((item, index) => ({
                  key: index + 1,
                  number: index + 1,
                  name: item.name,
                  price: item.price,
                  role: item.role,
                  duration: item.duration,
                }))}
              ></Table>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PackageList;
