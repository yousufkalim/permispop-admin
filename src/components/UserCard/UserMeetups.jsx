import React, { useState, useEffect, useMemo } from "react";
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

function UserMeetups(props) {
  const WebServicesManagers = useMemo(() => new WebServicesManager());
  const [meetupList, setmeetupList] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editMeetup, setEditMeetup] = useState(null);
  const [state, setState] = useState({
    items: [],
    zip: "",
    lat: 0,
    long: 0,
    address: "",
    disableAdd: true,
    meetupError: "",
  });

  // fetch all instructors by driving school
  useEffect(() => {
    getMeetupPoints(props.id);
  }, [updateList]);

  const getMeetupPoints = (userID) => {
    //get meetup points
    var tokn = localStorage.getItem("userdata");
    WebServicesManagers.getApiWithParamCall(
      {
        endPoint: "InstructorMeetupPoints/GetMeetUpPoints",
        dataToFetch: userID,
        token: tokn,
      },
      (statusCode, responseMp) => {
        if (responseMp.length > 0) {
          setmeetupList(responseMp);
        }
      }
    );
  };

  const getAddress = (e) => {
    var stateis = {
      ...state,
      address: e.target.value,
      lat: 0,
      long: 0,
      zip: "",
      city: "",
    };
    stateis.address = e.target.value;
    if (stateis.lat === 0 && stateis.long === 0) {
      stateis.disableAdd = true;
      stateis.meetupError = "Select From dropdown to continue.";
    } else {
      stateis.disableAdd = false;
      stateis.meetupError = "";
    }
    setState(stateis);
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
          setState({ ...state, items: addressToSet });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setAddress = (item) => {
    setState({ ...state, address: item });
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i].label === item) {
        var city = state.items[i].city;
        var zipCode = state.items[i].PostalCode;
        var lat = state.items[i].lat;
        var lng = state.items[i].lng;
        var newAddress = state.items[i].label.split(String(zipCode));
        setState({
          ...state,
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

  const handleAddMeetup = () => {
    console.log("adding mp", state);
    const meetupObj = JSON.stringify({
      instructorId: props.id,
      meetup: state.address,
      zipCode: state.zip,
      city: state.city,
      lat: state.lat,
      long: state.long,
    });
    WebServicesManagers.postApiCall(
      {
        endPoint: "InstructorMeetupPoints",
        dataToInsert: meetupObj,
      },
      (statusCode, response) => {
        if (response !== "") {
          setUpdateList(!updateList);
        }
      }
    );
    setShowAdd(false);
    setState({
      items: [],
      zip: "",
      lat: 0,
      long: 0,
      address: "",
      disableAdd: true,
      meetupError: "",
    });
  };

  const handleDeleteMeetup = (id) => {
    var con = window.confirm("Are you sure?");
    if (con) {
      var tokn = localStorage.getItem("userdata");
      WebServicesManagers.getApiWithParamCall(
        {
          endPoint: "InstructorMeetupPoints/deletemeetuppoint",
          dataToFetch: id,
          token: tokn,
        },
        (statusCode, responseMp) => {
          setUpdateList(!updateList);
        }
      );
    }
  };

  const updateClick = (meetup) => {
    setState({
      ...state,
      address: meetup.meetUp,
      city: meetup.city,
      zip: meetup.zipCode,
      lat: meetup.lat,
      long: meetup.long,
    });
    setShowUpdate(true);
    setEditMeetup(meetup);
  };

  const updateSubmit = () => {
    var tokn = localStorage.getItem("userdata");
    const meetupObj = JSON.stringify({
      ...editMeetup,
      meetUp: state.address,
      zipCode: state.zip,
      city: state.city,
      lat: state.lat,
      long: state.long,
    });
    WebServicesManagers.postApiCall(
      {
        endPoint: "InstructorMeetupPoints/updatemeetuppoint",
        dataToInsert: meetupObj,
        token: tokn,
      },
      (statusCode, response) => {
        if (response !== "") {
          setUpdateList(!updateList);
        }
      }
    );
    setShowUpdate(false);
    setState({
      items: [],
      zip: "",
      lat: 0,
      long: 0,
      address: "",
      disableAdd: true,
      meetupError: "",
    });
  };

  return (
    <Translation>
      {(t) => (
        <>
          <div className="table-responsive" style={{ overflowX: "scroll" }}>
            <i
              className="fa fa-plus-circle"
              style={{ float: "right", fontSize: 18, margin: "15px 10px" }}
              onClick={() => setShowAdd(true)}
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
                {meetupList.length > 0
                  ? meetupList.map((meetup, index) => (
                      <tr key={index}>
                        {console.log("meetuop", meetup)}
                        <td>{meetup.meetUp}</td>
                        <td>{meetup.zipCode}</td>
                        <td>{meetup.city}</td>
                        <td>
                          <i
                            className="fa fa-pencil"
                            onClick={() => updateClick(meetup)}
                          ></i>
                          <i
                            className="fa fa-trash"
                            onClick={() => handleDeleteMeetup(meetup.id)}
                          ></i>
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
          <Modal show={showAdd} onHide={() => setShowAdd(false)}>
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
                    items={state.items}
                    shouldItemRender={(item, value) =>
                      item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                    }
                    getItemValue={(item) => item.label}
                    renderItem={(item, highlighted) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: highlighted ? "#eee" : "transparent",
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
                    value={state.address}
                    onChange={getAddress}
                    onSelect={setAddress}
                  />
                  <HelpBlock>{state.meetupError}</HelpBlock>
                </FormGroup>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>ZipCode</ControlLabel>
                      <FormControl
                        type="text"
                        disabled={true}
                        value={state.zip}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>City</ControlLabel>
                      <FormControl
                        type="text"
                        disabled={true}
                        value={state.city}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                disabled={state.disableAdd}
                onClick={handleAddMeetup}
              >
                {t("Add")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* update */}
          <Modal show={showUpdate} onHide={() => setShowUpdate(false)}>
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
                    items={state.items}
                    shouldItemRender={(item, value) =>
                      item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                    }
                    getItemValue={(item) => item.label}
                    renderItem={(item, highlighted) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: highlighted ? "#eee" : "transparent",
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
                    value={state?.address}
                    onChange={getAddress}
                    onSelect={setAddress}
                  />
                  <HelpBlock>{state.meetupError}</HelpBlock>
                </FormGroup>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>ZipCode</ControlLabel>
                      <FormControl
                        type="text"
                        disabled={true}
                        value={state.zip}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <ControlLabel>City</ControlLabel>
                      <FormControl
                        type="text"
                        disabled={true}
                        value={state.city}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                disabled={state.disableAdd}
                onClick={updateSubmit}
              >
                {t("Add")}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Translation>
  );
}

export default UserMeetups;
