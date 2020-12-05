import React, { Component } from "react";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Row,
  HelpBlock,
} from "react-bootstrap";
import { Translation } from "react-i18next";

function FieldGroup({ validation, label, isImport, help, ...props }) {
  return (
    <Translation>
      {(t) => (
        <FormGroup>
          <ControlLabel>
            {t(label)}{" "}
            <span className={isImport ? "do-hide" : "text-red"}>*</span>
          </ControlLabel>
          <FormControl {...props} />
          <HelpBlock>{t(help)}</HelpBlock>
        </FormGroup>
      )}
    </Translation>
  );
}
export class FormInputs extends Component {
  render() {
    var row = [];
    for (var i = 0; i < this.props.ncols.length; i++) {
      row.push(
        <div key={i} className={this.props.ncols[i]}>
          <FieldGroup {...this.props.properties[i]} />
        </div>
      );
    }
    return <Row>{row}</Row>;
  }
}

export default FormInputs;
