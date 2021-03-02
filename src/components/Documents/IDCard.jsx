import React, { Component } from "react";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import { Grid, Row, Col } from "react-bootstrap";
import moment from "moment";

class DrivingLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log(this.props.surName);
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            {console.log("this.props.Type", this.props.Type)}
            {this.props.frontIDPhoto || this.props.backIDPhoto ? (
              this.props.Type === "fic" ? (
                <FileDisplay file={this.props.frontIDPhoto}>
                  {console.log("1st")}
                </FileDisplay>
              ) : (
                <FileDisplay file={this.props.backIDPhoto}>
                  {console.log("2nd")}
                </FileDisplay>
              )
            ) : (
              <FileDisplay
                file={`${process.env.REACT_APP_BASE_URL_FOR_IMAGES}CredentialFiles/placeholderimage.png`}
              >
                {console.log("placeholder")}
              </FileDisplay>
            )}

            {/* <FileDisplay
              file={
                this.props.Type === "fic"
                  ? this.props.frontIDPhoto
                  : this.props.backIDPhoto
              }
            /> */}
            {this.props.Type !== undefined ? (
              <a
                rel="noopener noreferrer"
                href={
                  this.props.Type === "fic"
                    ? this.props.frontIDPhoto
                    : this.props.backIDPhoto
                }
                target="_blank"
              >
                View file in new Tab.
              </a>
            ) : (
              ""
            )}
          </Col>

          <Col md={6}>
            <b>{this.props.Type === undefined ? "No Added Yet" : ""}</b>
            <br />
            <b>{this.props.firstName}</b>
            <br />
            Email: {this.props.email}
            <br />
            Gender:{this.props.gender}
            <br />
            Date of Birth: {moment(this.props.dob).format("DD/MM/YYYY")}
            <br />
            City: {this.props.city}
            <br />
            Zip: {this.props.zip}
            <br />
            Address: {this.props.address}
            <hr />
            <p style={{ color: "red", fontSize: 12 }}>
              **For Updating Data click on button <b>Update Data</b> under
              profile info card**
            </p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default DrivingLicense;
