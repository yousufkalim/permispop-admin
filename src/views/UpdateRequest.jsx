import React, { Component } from "react";
import { Grid, Row, Col, Tabs, Tab } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import moment from "moment";

export class UpdateRequest extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      pendingRequest: [],
      completed: [],
    };
  }

  componentDidMount() {
    //   makeing api call for getting all request for admin
    var token = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "Profile/GetAllRequestForAdmin",
        token,
      },
      (statusCode, responseRequest) => {
        console.log(responseRequest);
        var pendingList = [];
        var completeList = [];
        if (responseRequest.length > 0) {
          responseRequest.map((request) => {
            if (request.resolved) {
              completeList.push({ ...request, user: JSON.parse(request.user) });
            } else {
              pendingList.push({ ...request, user: JSON.parse(request.user) });
            }
          });
          this.setState({
            pendingRequest: pendingList,
            completed: completeList,
          });
        }
      }
    );
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Update Profile Data Request"
                content={
                  <div>
                    <Tabs
                      defaultActiveKey="pending"
                      transition={false}
                      id="noanim-tab-example"
                    >
                      <Tab eventKey="pending" title="Pending">
                        <div
                          style={{ padding: "10px 20px", marginTop: "5px" }}
                          className="table-responsive"
                        >
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Update Field</th>
                                <th>Description</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.pendingRequest.length > 0 ? (
                                this.state.pendingRequest.map((item) => (
                                  <tr>
                                    <td>{`${item.user.firstName} ${item.user.surName}`}</td>
                                    <td>{item.updateField}</td>
                                    <td>{item.description}</td>
                                    <td>{item.id}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    style={{
                                      fontWeight: "bold",
                                      textAlign: "center",
                                      paddingTop: "30px",
                                    }}
                                  >
                                    No Updation Request in pending
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Tab>
                      <Tab eventKey="completed" title="Completed">
                        <div
                          style={{ padding: "10px 10px", marginTop: "5px" }}
                          className="table-responsive"
                        >
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Update Field</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.completed.length > 0 ? (
                                this.state.completed.map((item) => (
                                  <tr>
                                    <td>{`${item.user.firstName} ${item.user.surName}`}</td>
                                    <td>{item.updateField}</td>
                                    <td>{item.description}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="3"
                                    style={{
                                      fontWeight: "bold",
                                      textAlign: "center",
                                      paddingTop: "30px",
                                    }}
                                  >
                                    No Updation request Completed
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UpdateRequest;
