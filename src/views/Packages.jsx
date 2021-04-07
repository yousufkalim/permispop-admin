import React, { Component } from "react";
import PackageList from "../../src/components/Packages/PackageList";
import AddUpdatePackage from "../../src/components/Packages/AddUpdatePackage";
// import Button from "components/CustomButton/CustomButton.jsx";
import MembershipSetting from "../../src/components/Packages/MembershipSetting";
import { Modal } from "antd";
import { motion } from "framer-motion";

class Packages extends Component {
  state = {
    addUpdate: false,
    showSettings: false,
    isModalVisible: false,
    isAddModalVisible: false,
    update: false,
  };
  toggle = (e) => {
    this.setState({
      addUpdate: !this.state.addUpdate,
      isAddModalVisible: false,
    });
  };

  showModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };
  showAddModal = () => {
    this.setState({
      isAddModalVisible: true,
    });
  };
  handleOk = () => {
    this.setState({
      isModalVisible: false,
      isAddModalVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      isAddModalVisible: false,
      isModalVisible: false,
    });
  };
  render() {
    return (
      <div>
        <Modal
          title="Settings"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          className="add-mp-modal"
        >
          <MembershipSetting />
        </Modal>
        <Modal
          title="Package Details"
          visible={this.state.isAddModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          className="add-mp-modal"
        >
          <AddUpdatePackage toggle={this.toggle} />
        </Modal>
        <div id="setting-panel"></div>
        <header
          className="pull-right"
          style={{
            fontSize: 28,
            position: "relative",
            zIndex: 100,
            display: "flex",
            flexDirection: "row",
            marginRight: "30px",
          }}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={this.showAddModal}
            style={{ margin: "6px 14px 6px 14px" }}
          >
            {/* <Button className="Package-btn"> */}
            <i className=" fas fa-plus package-icon"></i>
            {/* </Button> */}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={this.showModal}
            style={{ margin: "6px 14px 6px 14px" }}
          >
            {/* <Button className="Package-btn"> */}
            <i className="fas fa-cog package-icon"></i>
            {/* </Button> */}
          </motion.div>
          <div className="clearfix" />
        </header>
        <PackageList toggle={this.toggle} addUpdate={this.state.addUpdate} />
      </div>
    );
  }
}

export default Packages;
