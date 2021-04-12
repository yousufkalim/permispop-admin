import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Table, Button, Input, Space } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

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
        endPoint: "package/GetStudentPackages",
        token: tokn,
      },
      (statusCode, pgkDetails) => {
        this.setState({ packages: pgkDetails });
        this.setState({ loading: false });
        // console.log("did mount", this.state.packages);
      }
    );
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

  ////////////////////// Render ////////////////////////

  render() {
    const columns = [
      {
        title: "Sr. No.",
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
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        align: "center",
        width: 160,
        filters: [
          {
            text: "Monthly",
            value: "Monthly",
          },
          {
            text: "Quarterly",
            value: "Quarterly",
          },
          {
            text: "Yearly",
            value: "Yearly",
          },
        ],
        onFilter: (value, record) => record.duration.indexOf(value) === 0,
        sorter: (a, b) => a.duration.length - b.duration.length,
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        align: "center",
        width: 160,
        sorter: (a, b) => a.price - b.price,
        ...this.getColumnSearchProps("price"),
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
                scroll={{ y: 434, x: 0 }}
                columns={columns}
                onChange={this.onChange}
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
                dataSource={this.state.packages.map((item, index) => ({
                  key: index + 1,
                  number: index + 1,
                  name: item.name,
                  price: item.price,
                  role: item.role,
                  duration: item.type,
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
