import React, { Component } from "react";
import { Table, Modal, lg, Button } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

export class UserVehicle extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      vehicleInfo: [],
      profileData: null,
      showId: false,
      docTitle: "",
      idName: "veh",
      fbStatus: false,
      veh: true,
    };
  }

  componentDidMount() {
    this.loadVehicle();
    this.getData();
  }

  getData = (e) => {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Document/GetUserDoc",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, list) => {
        const newState = {};
        list
          .filter((item) => item.documentName.includes("veh"))
          .map((item) => {
            newState[item.documentName] = item;
          });
        this.setState(
          {
            ...this.state,
            ...newState,
          },
          () => {}
        );
      }
    );
  };

  loadVehicle = () => {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, responseProfile) => {
        var vehicle = "";
        if (responseProfile.role === "Instructor") {
          if (responseProfile.vehicleDetailInfoId !== "") {
            vehicle = JSON.parse(responseProfile.vehicleDetailInfoId);
          }
        } else {
          if (responseProfile.drivingSchoolVehiclesInfoId !== "") {
            vehicle = JSON.parse(responseProfile.drivingSchoolVehiclesInfoId);
          }
        }
        var vehicleData = {};
        Object.entries(vehicle).forEach(([key, value]) => {
          this.WebServicesManager.getApiWithParamCall(
            {
              endPoint: "VehicleDetail/GetVehicleDetailByIdAsync",
              dataToFetch: value,
              token: tokn,
            },
            (statusCode, responseVehicle) => {
              vehicleData[key] = responseVehicle;
              if (
                Object.entries(vehicleData).length ===
                Object.entries(vehicleData).length
              ) {
                this.setState(
                  { profileData: responseProfile, vehicleInfo: vehicleData },
                  () => {}
                );
              }
            }
          );
        });
      }
    );
  };

  render() {
    return (
      <div>
        <Table striped hover>
          <thead>
            <tr>
              <th>Document </th>
              <th>Verification Status </th>
              <th> </th>
            </tr>
          </thead>
          {this.props.role.toLowerCase() !== "student" ? (
            <tbody>
              {this.state.vehicleInfo !== "" ? (
                Object.entries(this.state.vehicleInfo).forEach(
                  ([key, value]) => {
                    // debugger;
                    if (value !== null) {
                      var key1 = key.split("Vehicle")[1];
                      return (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            {this.state[`veh${key1}`] === undefined ? (
                              ""
                            ) : this.state[`veh${key1}`].status === "" ? (
                              ""
                            ) : this.state[`veh${key1}`].status === "true" ? (
                              <i className="fa fa-check"></i>
                            ) : (
                              <i className="fa fa-remove"></i>
                            )}
                          </td>
                          <td>
                            <i
                              title="View Vehicle Details"
                              className="fa fa-file"
                              onClick={() =>
                                this.setState({
                                  showId: true,
                                  docTitle: { key },
                                  idName: "veh",
                                  fbStatus:
                                    this.state.veh === undefined
                                      ? false
                                      : this.state.veh.status,
                                })
                              }
                            ></i>
                          </td>
                        </tr>
                      );
                    }
                  }
                )
              ) : (
                <h1>No data</h1>
              )}
            </tbody>
          ) : (
            ""
          )}
        </Table>
      </div>
    );
  }
}

export default UserVehicle;
