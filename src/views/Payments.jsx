import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Tabs,
  Tab,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import moment from "moment";


class Payments extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
      super(props);
      this.state = {
          users:[],
          inactiveusers:[],
      };
  }
  componentWillMount() {

    this.WebServicesManager.getApiCall({
      endPoint: "Membership/GetAllActiveUsers"
    },
    (statusCode, responseMemeber)=>{
      if(responseMemeber.length > 0){
        responseMemeber.map(item=>{
          this.WebServicesManager.getApiWithParamCall(
            {
                endPoint: "Personal/GetAllById",
                dataToFetch: item.userId
            },
            (statusCode, responseUser) => {
              console.log("respisswe",responseUser,item);
              if(item.activated === 'true'){
                // debugger;
                const resp = {
                  firstName:responseUser.firstName,
                  surName:responseUser.surName,
                  gender:responseUser.gender,
                  email:responseUser.email,
                  address:responseUser.address,
                  pkgActiveDate:moment(item.packageActivationDate).format('ddd MMM DD YYYY'),
                  pkgExpireDate:moment(item.packageExpiryDate).format('ddd MMM DD YYYY'),
                }
                console.log("resp");
                this.setState({ users: [...this.state.users, resp] })
              }else{ 
                const resp = {
                  firstName:responseUser.firstName,
                  surName:responseUser.surName,
                  gender:responseUser.gender,
                  email:responseUser.email,
                  address:responseUser.address,
                  pkgActiveDate:moment(item.packageActivationDate).format('ddd MMM DD YYYY'),
                  pkgExpireDate:moment(item.packageExpiryDate).format('ddd MMM DD YYYY'),
                } 
                this.setState({ inactiveusers: [...this.state.inactiveusers, resp] })
              }
            });
        })
      }
    });
  }
  active = e => {
      alert("Payment Confirmed Successfully");
      this.WebServicesManager.getApiWithParamCall({
          endPoint: "Membership/Activate",
          dataToFetch: e.target.value
      }, 
      (s, r) => {
        //
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
                title="Verify User"
                content={
                    <div>
                      <Tabs defaultActiveKey="inactiveuser" transition={false} id="noanim-tab-example">
                        <Tab eventKey="inactiveuser" title="Non Verified">
                        <div style={{padding:'10px 20px',marginTop:'5px'}} className="table-responsive">
                            <table className="table table-striped table-bordered">
                              <thead>
                                <th>Verify</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Start Date</th>
                                <th>Expire Date</th>
                              </thead>
                              <tbody>
                                {
                                  this.state.inactiveusers.length > 0?
                                    this.state.inactiveusers.map( (item, idx)=> {
                                        return (
                                          <tr>
                                            <td><input type="checkbox"  value={item.id} onChange={this.active}/></td>
                                            <td>{`${item.firstName} ${item.surName}`}</td>
                                            <td>{item.gender}</td>
                                            <td>{`${item.email}`}</td>
                                            <td>{item.address}</td>
                                            <td>{item.pkgActiveDate}</td>
                                            <td>{item.pkgExpireDate}</td>
                                          </tr>
                                        );
                                    })
                                  :
                                  <td colspan="7" style={{fontWeight:'bold',textAlign:'center',marginTop:'30px'}}>No Inactive User</td>
                                }
                            </tbody>
                            </table>
                          </div>
                        </Tab>
                        <Tab eventKey="activeusers" title="Verified">
                          <div style={{padding:'10px 10px',marginTop:'5px'}} className="table-responsive">
                            <table className="table table-striped table-bordered">
                              <thead>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Start Date</th>
                                <th>Expire Date</th>
                              </thead>
                              <tbody>     
                                {
                                  this.state.users.length>0?
                                  this.state.users.map( (item, idx)=> {
                                      return (
                                              <tr key={idx}>
                                              {/* <td><input type="checkbox"  value={item.id} onChange={this.active}/></td> */}
                                                <td>{`${item.firstName} ${item.surName}`}</td>
                                                <td>{item.gender}</td>
                                                <td>{`${item.email}`}</td>
                                                <td>{item.address}</td>
                                                <td>{item.pkgActiveDate}</td>
                                                <td>{item.pkgExpireDate}</td>
                                              </tr>
                                            );
                                  })
                                  :
                                  <td colspan="6" style={{fontWeight:'bold',textAlign:'center',marginTop:'30px'}}>No active User</td>
                                }
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

export default Payments;
