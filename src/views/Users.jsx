import React, { Component } from "react";
import { Grid, Row, Col, Table, Button, Tabs, Tab, TabContainer } from "react-bootstrap";
import ReactDOM from "react-dom";
import Card from "components/Card/Card.jsx";
import {Link} from "react-router-dom";
import { thArrayUser } from "variables/Variables.jsx";
import UserCard from "components/UserCard/UserCard.jsx";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import UserDocuments from "components/UserCard/UserDocuments.jsx";
import UserPayments from "components/UserCard/UserPayments.jsx";
import 'font-awesome/css/font-awesome.min.css';
import { MDBDataTable } from 'mdbreact';

const $ = require("jquery");
$.DataTable = require("datatables.net");

const columns1 = [
    {title: "#"},
    { title: "Name" },
    { title: "Role" },
    { title: "Active" },
    { title: "Document Verified" },
    { title:"View Details"},
  ];

  const columns= [
    {
      label: '#',
      field: 'key',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Name',
      field: 'name',
      sort: 'asc',
      width: 270
    },
    {
      label: 'Role',
      field: 'role',
      sort: 'asc',
      width: 200
    },
    {
      label: 'Active',
      field: 'active',
      sort: 'asc',
      width: 100
    },
    {
      label: 'Document Verfied',
      field: 'docV',
      sort: 'asc',
      width: 150
    },
    {
      label: 'View Details',
      field: 'details',
      sort: 'asc',
      width: 100
    }
  ];

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
            documentVerified:"",
            dataV:{},
            dataNV:{},
        };
    }
    WebServicesManager = new WebServicesManager();
    handleClick(obj) {
        this.setState({ showDetails: !this.state.showDetails, userDetails: obj });
    }
    componentWillMount() {
        var nonV=[];
        var V=[];
        var VN=[];
        var NVN = [];
        var vc=1,nvc=1;
        var tokn = localStorage.getItem('userdata');
        this.WebServicesManager.getApiCall({
            endPoint: "Personal/GetAllUsers",
            token:tokn,
        }, (s, r) => {
            // console.log("r",r);
            r.map(item=>{
                if(item.role !== "Admin" && item.role !== "Email" ){
                    if(item.documentTested === "Tested" ){
                        VN.push({key:vc,name:item.firstName+" "+item.surName,role:item.role,active:<i className="fa fa-check" style={{color:'green'}}></i>,docV:<i className="fa fa-check" style={{color:'green'}}></i>,details:<Button onClick={() => this.handleClick(item)}><li className="pe-7s-look   fa-2x" title="View More"></li></Button>,clickEvent:() => this.handleClick(item)});
                        vc = vc+1;

                    }else{
                        NVN.push({key:nvc,name:item.firstName+" "+item.surName,role:item.role,active:<i className="fa fa-check" style={{color:'green'}}></i>,docV:<i className="fa fa-remove" style={{color:'red'}}></i>,details:<Button onClick={() => this.handleClick(item)}><li className="pe-7s-look   fa-2x" title="View More"></li></Button>,clickEvent:() => this.handleClick(item)});
                        // nonV.push(item);
                        nvc = nvc+1;
                    }
                }
            });
            var datais = {columns:columns,rows:VN}
            var datais1 = {columns:columns,rows:NVN}
            console.log("VN",VN,datais);
            this.setState({ allUsers: r,verfiedUser:V,nonVarifiedUser:nonV,dataV:datais,dataNV:datais1 });
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
                                        <Tabs defaultActiveKey="inactiveuser" id="noanim-tab-example">
                                            <Tab eventKey="inactiveuser" title="Non Verified">
                                                <Row className="table-responseive" style={{margin:10}}>
                                                    <MDBDataTable
                                                        bordered
                                                        data={this.state.dataNV}
                                                        className="dataTableNew"
                                                    />
                                                </Row>
                                            </Tab>
                                            <Tab eventKey="verfied" title="Verified">
                                                <Row className="table-responseive" style={{margin:10}}>
                                                    <MDBDataTable
                                                        bordered
                                                        data={this.state.dataV}
                                                        className="dataTableNew"
                                                    />
                                                </Row>
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
