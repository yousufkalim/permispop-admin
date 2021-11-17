import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Table, Button, Input, Space } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import { Translation } from "react-i18next";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

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
    this.getData();
  }

  getData = () => {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "package/GetAllPackages",
        token: tokn,
      },
      (statusCode, pgkDetails) => {
        console.log("did mount package", this.state.packages);
        this.setState({ packages: pgkDetails }, () => {
          console.log("pkg list ", this.state.packages);
        });
        this.setState({ loading: false });
      }
    );
    this.setState({ loading: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.addUpdate !== prevProps.addUpdate) {
      var tokn = localStorage.getItem("userdata");
      this.WebServicesManager.getApiCall(
        {
          endPoint: "package/GetAllPackages",
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

  handleDelete = (item) => {
    console.log("del pkg ", item);
    Swal.fire({
      title: "Es-tu sûr?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez-le!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRecord(item.id);
        Swal.fire(
          "Supprimé!",
          "Votre enregistrement a été supprimé.",
          "success"
        );
      }
    });
  };

  deleteRecord = (id) => {
    var tokn = localStorage.getItem("userdata");
    const baseUrl = process.env.REACT_APP_BASE_URL;
    fetch(`${baseUrl}package/DeletePackageById?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokn}`,
        "Content-type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log("delete data ", res);
        this.getData();

        // setCms(res.data);
      })
      .catch((err) => console.log(err.message));
  };

  ////////////////////// Render ////////////////////////

  render() {
    console.log("package list ", this.props);
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
        title: <Translation>{(t) => t("Name English")}</Translation>,
        dataIndex: "nameEnglish",
        key: "nameEnglish",
        align: "center",
        width: 160,
        sorter: (a, b) => a.nameEnglish.length - b.nameEnglish.length,
        ...this.getColumnSearchProps("nameEnglish"),
      },
      {
        title: <Translation>{(t) => t("Name French")}</Translation>,
        dataIndex: "nameFrench",
        key: "nameFrench",
        align: "center",
        width: 160,
        sorter: (a, b) => a.nameFrench.length - b.nameFrench.length,
        ...this.getColumnSearchProps("nameFrench"),
      },
      {
        title: <Translation>{(t) => t("Duration")}</Translation>,
        dataIndex: "duration",
        key: "duration",
        align: "center",
        width: 160,
        // filters: [
        //   {
        //     text: <Translation>{(t) => t("Monthly")}</Translation>,
        //     value: "Monthly",
        //   },
        //   {
        //     text: <Translation>{(t) => t("Quarterly")}</Translation>,
        //     value: "Quarterly",
        //   },
        //   {
        //     text: <Translation>{(t) => t("Yearly")}</Translation>,
        //     value: "Yearly",
        //   },
        // ],
        // onFilter: (value, record) => record.duration.indexOf(value) === 0,
        // sorter: (a, b) => a.duration.length - b.duration.length,
      },
      {
        title: <Translation>{(t) => t("Price")}</Translation>,
        dataIndex: "price",
        key: "price",
        align: "center",
        width: 160,
        render: (price) => <div>{`${price} €`}</div>,
        // sorter: (a, b) => a.price - b.price,
        // ...this.getColumnSearchProps("price"),
      },
      {
        title: <Translation>{(t) => t("Action")}</Translation>,
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 160,
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
                title="Delete"
                className="fa fa-trash simple-btn package-icon"
                onClick={() => this.handleDelete(item)}
              ></i>
            </motion.div>
          </div>
        ),
        // sorter: (a, b) => a.price - b.price,
        // ...this.getColumnSearchProps("price"),
      },
      // {
      //   title: <Translation>{(t) => t("Role")}</Translation>,
      //   dataIndex: "role",
      //   key: "role",
      //   align: "center",
      //   width: 160,
      //   filters: [
      //     {
      //       text: <Translation>{(t) => t("Student")}</Translation>,
      //       value: "Student",
      //     },
      //     {
      //       text: <Translation>{(t) => t("Instructor")}</Translation>,
      //       value: "Instructor",
      //     },
      //     {
      //       text: <Translation>{(t) => t("Driving School")}</Translation>,
      //       value: "Driving School",
      //     },
      //   ],
      //   onFilter: (value, record) => record.role.indexOf(value) === 0,
      //   sorter: (a, b) => a.role.length - b.role.length,
      // },
    ];
    return (
      <div className="content">
        <Translation>
          {(t) => (
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
                    dataSource={this.state.packages?.map((item, index) => ({
                      key: index + 1,
                      number: index + 1,
                      nameEnglish: item.nameEnglish,
                      nameFrench: item.nameFrench,
                      price: item.price,
                      // role: item.role,
                      duration:
                        item.duration === "1day"
                          ? t("1 Day")
                          : item.duration === "3day"
                          ? t("3 Days")
                          : item.duration === "7day"
                          ? t("7 Days")
                          : item.duration === "15day"
                          ? t("15 Days")
                          : item.duration === "1month" && t("1 Month"),
                      action: item,
                    }))}
                  ></Table>
                </Col>
              </Row>
            </Grid>
          )}
        </Translation>
      </div>
    );
  }
}

export default PackageList;
