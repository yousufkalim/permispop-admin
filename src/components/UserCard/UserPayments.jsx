import React, { Component } from "react";
import moment from "moment";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

class UserPayments extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      packageInfo: {},
      membershipInfo: {},
    };
  }
  componentWillMount() {
    var tokn = localStorage.getItem("userdata");
    if (this.props.role === "Student") {
      // get membership data
      this.WebServicesManager.getApiWithParamCall(
        {
          endPoint: "Membership/GetEligibleMember",
          dataToFetch: this.props.id + "&role=" + this.props.role,
          token: tokn,
        },
        (statusCode, responseMember) => {
          // get package details
          if (responseMember.packageId !== "0") {
            this.WebServicesManager.getApiWithParamCall(
              {
                endPoint: "package/GetPackageById",
                dataToFetch: responseMember.packageId,
                token: tokn,
              },
              (statusCode, pData) => {
                //debugger;
                this.setState({
                  packageInfo: pData,
                  membershipInfo: responseMember,
                });
              }
            );
          } else {
            this.setState({
              membershipInfo: responseMember,
            });
          }
        }
      );
    }
  }

  render() {
    const { role } = this.props;
    if (role === "Student" && this.state.membershipInfo.packageId !== "0") {
      return (
        <div className="content" style={{ width: "100%" }}>
          <div
            className="card card-user"
            style={{
              margin: "20px 7%",
              backgroundColor: "#ffaf1c",
              color: "white",
            }}
          >
            <div className="" style={{ padding: "20px" }}>
              <span style={{ fontSize: "20px" }}>
                Package Name: {this.state.packageInfo.name}
              </span>
              <br />
              <small>
                Status:{" "}
                {this.state.membershipInfo.activated ? "Active" : "Inactive "}
              </small>
              <br />
              <small>
                Start Date:{" "}
                {moment(this.state.membershipInfo.packageActivationDate).format(
                  "DD/MM/YYYY"
                )}
              </small>
              <br />
              <small>
                End Date:{" "}
                {moment(this.state.membershipInfo.packageExpiryDate).format(
                  "DD/MM/YYYY"
                )}
              </small>
              <br />
            </div>
            <hr />
            <div style={{ padding: "20px" }}>
              <h6
                className="card-subtitle mb-2 text-muted"
                style={{ color: "white", fontSize: "20px", margin: "10px 0px" }}
              >
                Duration: {this.state.packageInfo.type}
              </h6>
              <p className="card-text">Price: {this.state.packageInfo.price}</p>
              <p className="card-text">{this.state.packageInfo.desc1}</p>
              <p className="card-text">{this.state.packageInfo.desc2}</p>
              <p className="card-text">{this.state.packageInfo.desc3}</p>
            </div>
            <hr />
          </div>
        </div>
      );
    } else if (
      role === "Student" &&
      this.state.membershipInfo.packageId === "0"
    ) {
      return (
        <div className="content" style={{ width: "100%" }}>
          <div
            className="card card-user"
            style={{
              margin: "20px 7%",
              backgroundColor: "#ffaf1c",
              color: "white",
            }}
          >
            <div className="" style={{ padding: "20px" }}>
              <span style={{ fontSize: "16px" }}>N'est pas un membre.</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="content" style={{ width: "100%" }}>
          <div
            className="card card-user"
            style={{
              margin: "20px 7%",
              backgroundColor: "#ffaf1c",
              color: "white",
            }}
          >
            <div className="" style={{ padding: "20px" }}>
              <span style={{ fontSize: "16px" }}>
                L'adhésion n'est pas requise pour les utilisateurs de type{" "}
                <b>{this.props.role}</b>.
              </span>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default UserPayments;
