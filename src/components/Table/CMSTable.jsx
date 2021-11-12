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

const antIcon = (
  <div>
    <LoadingOutlined
      style={{ fontSize: 46, color: "#149e7a", marginTop: "30px" }}
      spin
    />
  </div>
);

const CMSTable = (props) => {
  //   const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({ searchText: "", searchedColumn: "" });
  const [loading, setLoading] = useState(false);

  const deleteHandler = (id) => {
    console.log("del record ", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        props.deleteRecord(id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log("search text ", selectedKeys);
    setSearch({
      ...search,
      searchText: !selectedKeys[0] ? "" : selectedKeys[0],
      searchedColumn: dataIndex,
    });
    setLoading(false);
    // this.setState(
    //   {
    //     searchText: !selectedKeys[0] ? "" : selectedKeys[0],
    //     searchedColumn: dataIndex,
    //     loading: false,
    //   },
    //   () => {
    //     this.getAllUsers();
    //   }
    // );
  };

  const getColumnSearchProps = (dataIndex) => {
    let searchInput;
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Translation>
            {(t) => (
              <Input
                ref={(node) => {
                  searchInput = node;
                }}
                placeholder={t("Search name")}
                value={selectedKeys[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() =>
                  handleSearch(selectedKeys, confirm, dataIndex)
                }
                style={{ width: 188, marginBottom: 8, display: "block" }}
              />
            )}
          </Translation>
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
          setTimeout(() => searchInput.select(), 100);
        }
      },
      render: (text) =>
        search.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[search.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
  };

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
      sorter: (a, b) => "",
      ...getColumnSearchProps("page"),
    },
    {
      title: <Translation>{(t) => t("Section")}</Translation>,
      dataIndex: "section",
      key: "section",
      align: "center",
      width: 80,
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
      // onFilter: (value, record) => record.role.indexOf(value) === 0,
      sorter: (a, b) => "",
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
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <DeleteOutlined
            onClick={() => deleteHandler(item.id)}
            style={{ fontSize: "16px", color: "#ff0000", cursor: "pointer" }}
            twoToneColor="#ff0000"
          />
          <EditOutlined
            onClick={() => props.editRecord(item)}
            style={{ fontSize: "16px", color: "#15a781", cursor: "pointer" }}
            twoToneColor="#15a781"
          />
          {/* <Button
            size="large"
            className="btn btn-success"
            onClick={AddRecordToDb}
          >
            {t("Delete")}
          </Button> */}
        </div>
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
    <div>
      <Table
        // onChange={this.onChange}
        loading={{
          indicator: antIcon,
          spinning: props.loading,
          size: "large",
        }}
        locale={
          props.loading
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
          props.cms !== undefined
            ? props.cms.map((item, index) => ({
                key: index + 1,
                index: index + 1,
                page: item.pageName,
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
  );
};

export default CMSTable;
