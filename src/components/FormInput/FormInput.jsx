import React from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";
import { Translation } from "react-i18next";

const FormInput = (props) => {
  return (
    <Translation>
      {(t) => (
        <FormGroup>
          <ControlLabel>{t(props.label)}</ControlLabel>
          <FormControl
            componentClass={props.cat}
            name={props.name}
            {...props}
            onChange={props.onChange}
            //   value={newCustom.user ? newCustom.user : ""}
            //   onChange={(e) => {
            //     setNewCustom({ ...newCustom, user: e.target.value });
            //   }}
          >
            {props.children}
            {/* <React.Fragment>
          {pages.map((page, index) => (
            <option value={page.value}>{page.name}</option>
          ))}
        </React.Fragment> */}
          </FormControl>
        </FormGroup>
      )}
    </Translation>
  );
};

export default FormInput;
