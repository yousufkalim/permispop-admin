import React from "react";
import { Modal, Button } from "antd";

const CustomModal = (props) => {
  return (
    <>
      <Modal
        {...props}
        // title="Basic Modal"
        // visible={isModalVisible}
        // onOk={handleOk}
        // onCancel={handleCancel}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default CustomModal;
