
import React, { Component } from "react";
import { Grid, Row, Col, Table, Button, Tabs, Tab, TabContainer } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArrayUser } from "variables/Variables.jsx";
import UserCard from "components/UserCard/UserCard.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import UserDocuments from "components/UserCard/UserDocuments.jsx";
import UserPayments from "components/UserCard/UserPayments.jsx";
import 'font-awesome/css/font-awesome.min.css';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            nonVarifiedUser:[],
            verfiedUser:[],
            users: [],
            showDetails: false,
            userDetails: {},
            documentVerified:""
        };
    }
    WebServicesManager = new WebServicesManager();
    handleClick(obj) {
        this.setState({ showDetails: !this.state.showDetails, userDetails: obj });
    }
    componentWillMount() {
        var nonV=[];
        var V=[];
        this.WebServicesManager.getApiCall({
            endPoint: "Personal/GetAllUsers"
        }, (s, r) => {
                console.log("r",r);
                r.map(item=>{
                    if(item.documentTested === "Tested" ){
                        V.push(item);
                    }else{
                        nonV.push(item);
                    }
                })
                this.setState({ allUsers: r,verfiedUser:V,nonVarifiedUser:nonV });
        });

        
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    {this.state.showDetails ?
                        <Row>
                            <Row>
                                <Col md={12}>
                                    <a href="#" onClick={() => window.location.reload()}> <i className="fa fa-arrow-circle-left"></i>Back to list</a>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <UserCard
                                        bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                        {...this.state.userDetails} />
                                        
                                </Col>
                                <Col md={8}>
                                    <Card
                                        title=""
                                        category=""
                                        ctTableFullWidth
                                        ctTableResponsive
                                        content={
                                            <TabContainer className="content">
                                                <Tabs defaultActiveKey="Payments">
                                                    <Tab eventKey="Payments" title="Payments" id="1">
                                                        <UserPayments {...this.state.userDetails} />
                                                    </Tab>
                                                    <Tab eventKey="documents" title="Documents" id="2">
                                                        <UserDocuments {...this.state.userDetails} />
                                                    </Tab>
                                                </Tabs>
                                            </TabContainer>
                                        }
                                    />

                                </Col>
                            </Row>
                        </Row> :
                        <Row>
                            <Col md={12}>
                                <Card
                                    title="Users"
                                    category=""
                                    ctTableFullWidth
                                    ctTableResponsive
                                    content={
                                        <Tabs defaultActiveKey="inactiveuser" transition={false} id="noanim-tab-example">
                                            <Tab eventKey="inactiveuser" title="Non Verified">
                        
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            {thArrayUser.map((prop, key) => {
                                                                return <th key={key}>{prop}</th>;
                                                            })}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.nonVarifiedUser.map((prop, key) => {
                                                            if(prop.role !== "Admin" && prop.role !== "Deleted DSInstructor"){
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{key + 1}</td>
                                                                        <td>{prop.firstName + " " + prop.surName}</td>
                                                                        <td>{prop.role==="DSInstructor"?"DrivingSchool Instructor":prop.role}</td>
                                                                        <td>{prop.active}</td>
                                                                        {/* <td>{prop.verified}</td> */}
                                                                        <td>{prop.documentTested === "Tested"?<i className="fa fa-check" style={{color:'green'}}></i>: <i className="fa fa-remove" style={{color:'red'}}></i>}</td>
                                                                            {/* {this.state.userDetails.documentTested === undefined ? "" : this.state.userDetails.documentTested === "" ? "" : this.state.userDetails.documentTested === "Tested" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td> */}
                                                                        <td><Button onClick={() => this.handleClick(prop)}><li className="pe-7s-look   fa-2x" title="View More"></li></Button></td>
                                                                    </tr>
                                                                );
                                                            }
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Tab>
                                            <Tab eventKey="verfied" title="Verified">
                        
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            {thArrayUser.map((prop, key) => {
                                                                return <th key={key}>{prop}</th>;
                                                            })}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.verfiedUser.map((prop, key) => {
                                                            if(prop.role !== "Admin" && prop.role !== "Deleted DSInstructor"){
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{key + 1}</td>
                                                                        <td>{prop.firstName + " " + prop.surName}</td>
                                                                        <td>{prop.role==="DSInstructor"?"DrivingSchool Instructor":prop.role}</td>
                                                                        <td>{prop.active}</td>
                                                                        {/* <td>{prop.verified}</td> */}
                                                                        <td>{prop.documentTested === "Tested"?<i className="fa fa-check" style={{color:'green'}}></i>: <i className="fa fa-remove" style={{color:'red'}}></i>}</td>
                                                                            {/* {this.state.userDetails.documentTested === undefined ? "" : this.state.userDetails.documentTested === "" ? "" : this.state.userDetails.documentTested === "Tested" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td> */}
                                                                        <td><Button onClick={() => this.handleClick(prop)}><li className="pe-7s-look   fa-2x" title="View More"></li></Button></td>
                                                                    </tr>
                                                                );
                                                            }
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Tab>
                                        </Tabs>
                                    }
                                />
                                
                            </Col>
                        </Row>
                    }
                </Grid>
            </div>
        );
    }
}

export default Users;
