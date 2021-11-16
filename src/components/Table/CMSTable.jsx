import React, { useState } from "react";
import { Table, Button, Input, Space } from "antd";
import { Translation } from "react-i18next";
import Swal from "sweetalert2";
import {
  SearchOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { motion } from "framer-motion";

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

class CMSTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchColumn: "",
      loading: false,
    };
  }

  //   const [searchedColumn, setSearchedColumn] = useState("");
  // const [search, setSearch] = useState({ searchText: "", searchedColumn: "" });
  // const [loading, setLoading] = useState(false);

  deleteHandler = (id) => {
    console.log("del record ", id);
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.deleteRecord(id);
        Swal.fire("Deleted!", "Your record has been deleted.", "success");
      }
    });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
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
          placeholder={`Rechercher`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 220, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="add-package-button"
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined className="icon-search" />}
            size="small"
            style={{ width: 120 }}
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

  render() {
    const columns = [
      {
        title: "SR. #",
        dataIndex: "index",
        key: "index",
        align: "center",
        fontWeight: 400,
        width: 40,

        // sorter: (a, b) => a.number - b.number,
        //   ...this.getColumnSearchProps("number"),
      },
      {
        title: <Translation>{(t) => t("Page")}</Translation>,
        dataIndex: "page",
        key: "page",
        align: "center",
        width: 70,
        sorter: (a, b) => a.page.length - b.page.length,
        ...this.getColumnSearchProps("page"),
      },
      {
        title: <Translation>{(t) => t("Section")}</Translation>,
        dataIndex: "section",
        key: "section",
        align: "center",
        width: 80,
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
        //       value: "DrivingSchool",
        //     },
        //     {
        //       text: <Translation>{(t) => t("Car Rental Agent")}</Translation>,
        //       value: "CarRentalAgent",
        //     },
        //   ],
        // onFilter: (value, record) => record.role.indexOf(value) === 0,
        sorter: (a, b) => a.section.length - b.section.length,
      },
      {
        title: <Translation>{(t) => t("Card")}</Translation>,
        dataIndex: "card",
        key: "card",
        align: "center",
        width: 60,
        //   render: (active) => (
        //     <div
        //       style={{
        //         display: "flex",
        //         alignItems: "center",
        //         flexDirection: "row",
        //         justifyContent: "center",
        //       }}
        //     >
        //       {active === true ? (
        //         <i className="fa fa-check" style={{ color: "green" }}></i>
        //       ) : (
        //         <i className="fa fa-remove" style={{ color: "red" }}></i>
        //       )}
        //     </div>
        //   ),
      },

      {
        title: <Translation>{(t) => t("Heading")}</Translation>,
        dataIndex: "heading",
        key: "heading",
        align: "center",
        width: 150,
        render: (count) => <div>{count}</div>,
      },
      {
        title: <Translation>{(t) => t("Action")}</Translation>,
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 50,
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
                className="fa fa-pencil  package-icon simple-btn"
                onClick={() => this.props.editRecord(item)}
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
              <i
                style={{ fontSize: "20px" }}
                title="Delete"
                className="fa fa-trash simple-btn package-icon"
                onClick={() => this.deleteHandler(item.id)}
              ></i>
            </motion.div>
          </div>
          // <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          //   <DeleteOutlined
          //     onClick={() => deleteHandler(item.id)}
          //     style={{ fontSize: "16px", color: "#ff0000", cursor: "pointer" }}
          //     twoToneColor="#ff0000"
          //   />
          //   <EditOutlined
          //     onClick={() => props.editRecord(item)}
          //     style={{ fontSize: "16px", color: "#15a781", cursor: "pointer" }}
          //     twoToneColor="#15a781"
          //   />
          //   {/* <Button
          //     size="large"
          //     className="btn btn-success"
          //     onClick={AddRecordToDb}
          //   >
          //     {t("Delete")}
          //   </Button> */}
          // </div>
        ),
      },
      // {
      //   title: <Translation>{(t) => t("View Details")}</Translation>,
      //   dataIndex: "details",
      //   key: "details",
      //   align: "center",
      //   width: 130,
      //   render: (detail) => (
      //     <div
      //       style={{
      //         display: "flex",
      //         alignItems: "center",
      //         flexDirection: "row",
      //         justifyContent: "center",
      //       }}
      //     >
      //       <motion.div
      //         whileHover={{ scale: 1.2 }}
      //         whileTap={{ scale: 0.8 }}
      //         style={{
      //           margin: "6px 6px 6px 6px",
      //           width: "10%",
      //           borderRadius: "50%",
      //         }}
      //       >
      //         <i
      //           style={{ fontSize: "20px" }}
      //           title="View More"
      //           className="fa fa-eye fa-2xl  package-icon simple-btn"
      //           onClick={() => this.handleClick(detail)}
      //         ></i>
      //       </motion.div>
      //     </div>
      //   ),
      // },
    ];
    return (
      <Translation>
        {(t) => (
          <div>
            <Table
              // onChange={this.onChange}
              loading={{
                indicator: antIcon,
                spinning: this.props.loading,
                size: "large",
              }}
              locale={
                this.props.loading
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
              scroll={{ y: "48vh", x: 0 }}
              columns={columns}
              pagination={{
                position: ["bottomCenter"],
                size: "small",
                // showQuickJumper: true,
                defaultPageSize: 10,
                defaultCurrent: 1,
                //   total: this.state.total,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],

                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} Lignes`,
              }}
              dataSource={
                this.props.cms !== undefined
                  ? this.props.cms.map((item, index) => ({
                      key: index + 1,
                      index: index + 1,
                      page: t(item.pageName),
                      section: item.sectionName,
                      card: item.cardName,
                      heading: item.headingEnglish,
                      action: item,
                      //   rating: item.rating,
                      //   count: item.count,
                      //   details: item.details,
                    }))
                  : ""
              }
            ></Table>
          </div>
        )}
      </Translation>
    );
  }
}

export default CMSTable;
