import React from "react";
import { Select } from "antd";
import { Translation } from "react-i18next";
import { Typography } from "antd";

const { Title } = Typography;

const { Option } = Select;

const FormSelect = (props) => {
  return (
    <Translation>
      {(t) => (
        <div style={{ marginBlock: "5px 20px" }}>
          <div style={{ fontSize: "16px", fontWeight: "400" }}>
            {t(props.label)}
          </div>
          <Select
            style={props.style}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
          >
            {props.children}
            {/* {pages &&
                        pages.map((page, index) => (
                          <Option key={page.value}>{page.name}</Option>
                        ))} */}
            {/* {cities.map((city) => (
                        <Option key={city}>{city}</Option>
                      ))} */}
          </Select>
        </div>
      )}
    </Translation>
  );
};

export default FormSelect;
