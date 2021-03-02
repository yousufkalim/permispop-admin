import React, { Component } from "react";
import {
  Modal,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Row,
  Col,
  HelpBlock,
  Form,
} from "react-bootstrap";
import Autocomplete from "react-autocomplete";
import { Translation } from "react-i18next";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

export class UserMeetups extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      city: "",
      zip: "",
      lat: 0,
      long: 0,
      showAdd: false,
      showUpdate: false,
      meetupList: [],
      disableAdd: true,
      items: [],
      meetupError: "",
    };
  }

  componentWillMount() {
    this.getMeetupPoints(this.props.id);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.updateList !== this.state.updateList)
      this.getMeetupPoints(this.props.id);
  }
  // get data from
  getMeetupPoints = (userID) => {
    //get meetup points
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "InstructorMeetupPoints/GetMeetUpPoints",
        dataToFetch: userID,
        token: tokn,
      },
      (statusCode, responseMp) => {
        if (responseMp.length > 0) {
          this.setState({ meetupList: responseMp });
        }
      }
    );
  };

  getAddress = (e) => {
    this.setState(
      {
        address: e.target.value,
        lat: 0,
        long: 0,
        zip: "",
        city: "",
      },
      () => {
        if (!this.state.lat && !this.state.long) {
          this.setState({
            disableAdd: true,
            meetupError: "Select From dropdown to continue.",
          });
        } else {
          this.setState({ disableAdd: false, meetupError: "" });
        }
      }
    );
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=housenumber&autocomplete=1&limit=15"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        var addressToSet = [];
        for (var i = 0; i < responseJson.features.length; i++) {
          addressToSet.push({
            id: i,
            label: responseJson.features[i].properties.label,
            city: responseJson.features[i].properties.city,
            PostalCode: responseJson.features[i].properties.postcode,
            lat: responseJson.features[0].geometry.coordinates[1],
            lng: responseJson.features[0].geometry.coordinates[0],
          });
        }

        if (addressToSet.length === responseJson.features.length) {
          this.setState({ items: addressToSet });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  setAddress = (item) => {
    this.setState({ address: item });
    const { items } = this.state;
    for (let i = 0; i < items.length; i++) {
      if (items[i].label === item) {
        var city = items[i].city;
        var zipCode = items[i].PostalCode;
        var lat = items[i].lat;
        var lng = items[i].lng;
        var newAddress = items[i].label.split(String(zipCode));
        this.setState({
          address: newAddress[0],
          zip: zipCode,
          city: city,
          lat: lat,
          long: lng,
          disableAdd: false,
          meetupError: "",
        });
      }
    }
  };

  handleAddMeetup = () => {
    const meetupObj = JSON.stringify({
      instructorId: this.props.id,
      meetup: this.state.address,
      zipCode: this.state.zip,
      city: this.state.city,
      lat: this.state.lat,
      long: this.state.long,
    });
    this.setState({ disableAdd: true });
    this.WebServicesManager.postApiCall(
      {
        endPoint: "InstructorMeetupPoints",
        dataToInsert: meetupObj,
      },
      (statusCode, response) => {
        if (response !== "") {
          this.setState({
            showAdd: false,
            items: [],
            zip: "",
            lat: 0,
            long: 0,
            address: "",
            disableAdd: true,
            meetupError: "",
            updateList: !this.state.updateList,
          });
        }
      }
    );
  };

  handleDeleteMeetup = (id) => {
    var con = window.confirm("Are you sure?");
    if (con) {
      var tokn = localStorage.getItem("userdata");
      this.WebServicesManager.getApiWithParamCall(
        {
          endPoint: "InstructorMeetupPoints/deletemeetuppoint",
          dataToFetch: id,
          token: tokn,
        },
        (statusCode, responseMp) => {
          this.setState({ updateList: !this.state.updateList });
        }
      );
    }
  };

  updateClick = (meetup) => {
    this.setState({
      address: meetup.meetUp,
      city: meetup.city,
      zip: meetup.zipCode,
      lat: meetup.lat,
      long: meetup.long,
      showUpdate: true,
      editMeetup: meetup,
    });
  };

  updateSubmit = () => {
    var tokn = localStorage.getItem("userdata");
    const meetupObj = JSON.stringify({
      ...this.state.editMeetup,
      meetUp: this.state.address,
      zipCode: this.state.zip,
      city: this.state.city,
      lat: this.state.lat,
      long: this.state.long,
    });
    this.setState({ disableAdd: true });
    this.WebServicesManager.postApiCall(
      {
        endPoint: "InstructorMeetupPoints/updatemeetuppoint",
        dataToInsert: meetupObj,
        token: tokn,
      },
      (statusCode, response) => {
        if (response !== "") {
          this.setState({
            showUpdate: false,
            items: [],
            zip: "",
            lat: 0,
            long: 0,
            address: "",
            disableAdd: true,
            meetupError: "",
            updateList: !this.state.updateList,
          });
        }
      }
    );
  };

  render() {
    return (
      <Translation>
        {(t) => (
          <>
            <div className="table-responsive" style={{ overflowX: "scroll" }}>
              <i
                title="Add Meetup Point"
                className="fa fa-plus-circle"
                style={{ float: "right", fontSize: 18, margin: "15px 10px" }}
                onClick={() => this.setState({ showAdd: true })}
              ></i>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>ZipCode</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.meetupList.length > 0
                    ? this.state.meetupList.map((meetup, index) => (
                        <tr key={index}>
                          {console.log("meetuop", meetup)}
                          <td>{meetup.meetUp}</td>
                          <td>{meetup.zipCode}</td>
                          <td>{meetup.city}</td>
                          <td>
                            <i
                              title="Edit"
                              className="fa fa-pencil"
                              onClick={() => this.updateClick(meetup)}
                            ></i>
                            <i
                              title="Delete"
                              className="fa fa-trash"
                              onClick={() => this.handleDeleteMeetup(meetup.id)}
                            ></i>
                          </td>
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
            </div>
            <Modal
              show={this.state.showAdd}
              onHide={() => this.setState({ showAdd: false })}
            >
              <Modal.Header closeButton>
                <Modal.Title>{t("Add Meetup Location")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <FormGroup>
                    <ControlLabel>
                      {t("Address")} <span className="text-red">*</span>
                    </ControlLabel>
                    <Autocomplete
                      items={this.state.items}
                      shouldItemRender={(item, value) =>
                        item.label.toLowerCase().indexOf(value.toLowerCase()) >
                        -1
                      }
                      getItemValue={(item) => item.label}
                      renderItem={(item, highlighted) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: highlighted
                              ? "#eee"
                              : "transparent",
                          }}
                        >
                          {item.label}
                        </div>
                      )}
                      wrapperStyle={{
                        display: "block",
                      }}
                      menuStyle={{
                        zIndex: "1",
                        position: "static",
                        borderRadius: "3px",
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                        background: "rgba(255, 255, 255, 0.9)",
                        padding: "2px 0",
                        fontSize: "90%",
                        overflow: "auto",
                        // maxHeight: "50%",
                        maxheight: "150px",
                        overflowY: "scroll",
                      }}
                      inputProps={{
                        className: "form-control",
                      }}
                      value={this.state.address}
                      onChange={this.getAddress}
                      onSelect={this.setAddress}
                    />
                    <HelpBlock>{this.state.meetupError}</HelpBlock>
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <ControlLabel>ZipCode</ControlLabel>
                        <FormControl
                          type="text"
                          disabled={true}
                          value={this.state.zip}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <ControlLabel>City</ControlLabel>
                        <FormControl
                          type="text"
                          disabled={true}
                          value={this.state.city}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  disabled={this.state.disableAdd}
                  onClick={this.handleAddMeetup}
                >
                  {t("Add")}
                </Button>
              </Modal.Footer>
            </Modal>
            {/* update */}
            <Modal
              show={this.state.showUpdate}
              onHide={() => this.setState({ showUpdate: false })}
            >
              <Modal.Header closeButton>
                <Modal.Title>{t("Update Meetup Location")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <FormGroup>
                    <ControlLabel>
                      {t("Address")} <span className="text-red">*</span>
                    </ControlLabel>
                    <Autocomplete
                      items={this.state.items}
                      shouldItemRender={(item, value) =>
                        item.label.toLowerCase().indexOf(value.toLowerCase()) >
                        -1
                      }
                      getItemValue={(item) => item.label}
                      renderItem={(item, highlighted) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: highlighted
                              ? "#eee"
                              : "transparent",
                          }}
                        >
                          {item.label}
                        </div>
                      )}
                      wrapperStyle={{
                        display: "block",
                      }}
                      menuStyle={{
                        zIndex: "1",
                        position: "static",
                        borderRadius: "3px",
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                        background: "rgba(255, 255, 255, 0.9)",
                        padding: "2px 0",
                        fontSize: "90%",
                        overflow: "auto",
                        // maxHeight: "50%",
                        maxheight: "150px",
                        overflowY: "scroll",
                      }}
                      inputProps={{
                        className: "form-control",
                      }}
                      value={this.state.address}
                      onChange={this.getAddress}
                      onSelect={this.setAddress}
                    />
                    <HelpBlock>{this.state.meetupError}</HelpBlock>
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <ControlLabel>ZipCode</ControlLabel>
                        <FormControl
                          type="text"
                          disabled={true}
                          value={this.state.zip}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <ControlLabel>City</ControlLabel>
                        <FormControl
                          type="text"
                          disabled={true}
                          value={this.state.city}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  disabled={this.state.disableAdd}
                  onClick={this.updateSubmit}
                >
                  {t("Update")}
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Translation>
    );
  }
}

export default UserMeetups;
