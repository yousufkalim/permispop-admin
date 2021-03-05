import React, { Component } from "react";
import { Grid, Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Card } from "components/Card/Card.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";

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
    this.loadData();
  }

  loadData = () => {
    this.setState({
      pendingRequest: [],
      completed: [],
    });
    var token = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "Profile/GetAllRequestForAdmin",
        token,
      },
      (statusCode, responseRequest) => {
        // console.log("responseRequest", responseRequest);
        var pendingList = [];
        var completeList = [];
        if (responseRequest.length > 0) {
          responseRequest.map((request) => {
            if (request.resolved) {
              completeList.push({ ...request, user: JSON.parse(request.user) });
            } else {
              pendingList.push({ ...request, user: JSON.parse(request.user) });
            }
            return null;
          });
          this.setState({
            pendingRequest: pendingList,
            completed: completeList,
          });
        }
      }
    );
  };

  MakeRequestComplete = (id) => {
    var token = localStorage.getItem("userdata");
    this.WebServicesManager.getApiCall(
      {
        endPoint: `Profile/updateRequestStatus?id=${id}`,
        token,
      },
      (statusCode, returnStatus) => {
        this.loadData();
      }
    );
  };

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
                      transition="false"
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
                                this.state.pendingRequest.map(
                                  (item) =>
                                    item.user && (
                                      <tr>
                                        <td>{`${item.user.firstName} ${item.user.surName}`}</td>
                                        <td>{item.updateField}</td>
                                        <td>{item.description}</td>
                                        <td>
                                          <Button
                                            style={{ margin: "5px 10px" }}
                                            varient="success"
                                            onClick={() =>
                                              this.MakeRequestComplete(item.id)
                                            }
                                          >
                                            Complete
                                          </Button>
                                          <Link
                                            to={{
                                              pathname: "/admin/users",
                                              user_id: item.user.id,
                                            }}
                                          >
                                            <Button
                                              style={{ margin: "5px 10px" }}
                                            >
                                              Update Profile
                                            </Button>
                                          </Link>
                                        </td>
                                      </tr>
                                    )
                                )
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
